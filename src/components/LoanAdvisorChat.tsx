import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, MessageCircle, Upload, FileText, Check, CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'delivered' | 'read';
  metadata?: {
    showApplyButton?: boolean;
    bankName?: string;
    loanType?: string;
    applyUrl?: string;
  };
}

const LoanAdvisorChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-loan-advisor', handleOpenChat);
    return () => window.removeEventListener('open-loan-advisor', handleOpenChat);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen]);

  // Mark messages as read when chat is open
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && lastMsg.status !== 'read') {
        setTimeout(() => {
          setMessages(prev => prev.map((msg, idx) => 
            idx === prev.length - 1 && msg.role === 'assistant' 
              ? { ...msg, status: 'read' as const } 
              : msg
          ));
        }, 500);
      }
    }
  }, [isOpen, messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const initializeConversation = async () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { data: user } = await supabase.auth.getUser();
    
    const { data: conversation, error } = await supabase
      .from('chat_conversations')
      .insert({
        session_id: sessionId,
        user_id: user?.user?.id || null,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
    } else {
      setConversationId(conversation.id);
    }

    streamChat([]);
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string, metadata?: any) => {
    if (!conversationId) return;

    await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      role,
      content,
      metadata: metadata || {}
    });
  };

  const streamChat = async (currentMessages: Message[]) => {
    setIsLoading(true);
    setIsTyping(true);
    let assistantMessage = '';
    let streamingMessageIndex = -1;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/loan-advisor-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: currentMessages.map(m => ({ role: m.role, content: m.content })) }),
        }
      );

      if (!response.ok) {
        setIsTyping(false);
        if (response.status === 429) {
          toast({
            title: 'Rate Limit Exceeded',
            description: 'Too many requests. Please try again later.',
            variant: 'destructive',
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: 'Service Unavailable',
            description: 'AI service needs credits. Please contact support.',
            variant: 'destructive',
          });
          return;
        }
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              if (streamingMessageIndex === -1) {
                // First token - hide typing indicator and add new message
                setIsTyping(false);
                setMessages((prev) => {
                  streamingMessageIndex = prev.length;
                  return [...prev, { 
                    role: 'assistant', 
                    content: content, 
                    timestamp: new Date()
                  }];
                });
                assistantMessage = content;
              } else {
                // Subsequent tokens - update existing message
                assistantMessage += content;
                const currentContent = assistantMessage;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  if (newMessages[streamingMessageIndex]) {
                    newMessages[streamingMessageIndex] = {
                      ...newMessages[streamingMessageIndex],
                      content: currentContent,
                    };
                  }
                  return newMessages;
                });
              }
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (assistantMessage) {
        await saveMessage('assistant', assistantMessage);
        // Mark as delivered after saving
        setMessages(prev => prev.map((msg, idx) => 
          idx === streamingMessageIndex 
            ? { ...msg, status: 'delivered' as const } 
            : msg
        ));
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from AI advisor',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input, 
      timestamp: new Date(),
      status: 'sending'
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    // Mark as delivered after a brief delay
    setTimeout(() => {
      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 && msg.role === 'user' && msg.status === 'sending'
          ? { ...msg, status: 'delivered' as const }
          : msg
      ));
    }, 300);

    await saveMessage('user', input);
    
    // Mark as read (AI has received it)
    setTimeout(() => {
      setMessages(prev => prev.map((msg, idx) => 
        idx === prev.length - 1 && msg.role === 'user'
          ? { ...msg, status: 'read' as const }
          : msg
      ));
    }, 600);

    await streamChat(newMessages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingDoc(true);
    const uploadedFiles: string[] = [];

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user?.id) {
        toast({
          title: 'Login Required',
          description: 'Please login to upload documents',
          variant: 'destructive',
        });
        return;
      }

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.user.id}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('user-documents')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: 'Upload Failed',
            description: `Failed to upload ${file.name}`,
            variant: 'destructive',
          });
        } else {
          uploadedFiles.push(file.name);
        }
      }

      if (uploadedFiles.length > 0) {
        const uploadMessage = `I have uploaded the following documents: ${uploadedFiles.join(', ')}`;
        const userMessage: Message = { 
          role: 'user', 
          content: uploadMessage, 
          timestamp: new Date(),
          status: 'delivered'
        };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        await saveMessage('user', uploadMessage);
        await streamChat(newMessages);
      }
    } catch (error) {
      console.error('Document upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload documents',
        variant: 'destructive',
      });
    } finally {
      setUploadingDoc(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyClick = (loanType: string, bankName: string) => {
    const applyMessage = `Yes, I want to apply for a ${loanType} loan at ${bankName}. Please help me with the application.`;
    const userMessage: Message = { 
      role: 'user', 
      content: applyMessage, 
      timestamp: new Date(),
      status: 'delivered'
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveMessage('user', applyMessage);
    streamChat(newMessages);
  };

  const renderMessageContent = (message: Message) => {
    const content = message.content;
    
    const applyMatch = content.match(/\[APPLY_BUTTON:([^:]+):([^\]]+)\]/);
    const linkMatch = content.match(/\[LOAN_LINK:([^\]]+)\]/);
    
    let displayContent = content
      .replace(/\[APPLY_BUTTON:[^\]]+\]/g, '')
      .replace(/\[LOAN_LINK:[^\]]+\]/g, '');

    return (
      <div>
        <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
        {applyMatch && message.role === 'assistant' && (
          <Button
            size="sm"
            className="mt-2"
            onClick={() => handleApplyClick(applyMatch[1], applyMatch[2])}
          >
            Apply for {applyMatch[1]} at {applyMatch[2]}
          </Button>
        )}
        {linkMatch && message.role === 'assistant' && (
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => window.open(`/loan-application/${linkMatch[1].toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Go to {linkMatch[1]} Application
          </Button>
        )}
      </div>
    );
  };

  const renderReadReceipt = (message: Message) => {
    if (message.role !== 'user') return null;
    
    return (
      <div className="flex items-center gap-1 mt-1">
        <span className="text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>
        {message.status === 'sending' && (
          <Check className="w-3 h-3 text-muted-foreground" />
        )}
        {message.status === 'delivered' && (
          <CheckCheck className="w-3 h-3 text-muted-foreground" />
        )}
        {message.status === 'read' && (
          <CheckCheck className="w-3 h-3 text-primary" />
        )}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[600px] sm:max-h-[80vh] bg-background border rounded-lg shadow-2xl flex flex-col z-50">
      <div className="px-4 py-3 border-b flex items-center justify-between bg-primary text-primary-foreground sm:rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-primary" />
          </div>
          <div>
            <span className="font-semibold text-sm">AI Loan Advisor</span>
            <p className="text-[10px] text-primary-foreground/70">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary/80">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-3" ref={scrollAreaRef}>
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {renderMessageContent(message)}
              </div>
              {message.role === 'user' ? (
                renderReadReceipt(message)
              ) : (
                <span className="text-[10px] text-muted-foreground mt-1">
                  {formatTime(message.timestamp)}
                </span>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-muted-foreground">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="px-4 py-3 border-t">
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleDocumentUpload}
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || uploadingDoc}
            title="Upload documents"
          >
            <Upload className="w-4 h-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanAdvisorChat;
