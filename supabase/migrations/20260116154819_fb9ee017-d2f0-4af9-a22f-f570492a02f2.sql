-- Fix overly permissive INSERT policy on chat_conversations
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;

CREATE POLICY "Authenticated users can create conversations"
ON public.chat_conversations
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = user_id) OR (user_id IS NULL)
);

-- Fix overly permissive INSERT policy on chat_messages  
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;

CREATE POLICY "Authenticated users can insert messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_conversations
    WHERE chat_conversations.id = chat_messages.conversation_id
    AND ((chat_conversations.user_id = auth.uid()) OR (chat_conversations.user_id IS NULL))
  )
);

-- Fix overly permissive INSERT policy on loan_applications
DROP POLICY IF EXISTS "Anyone can submit loan applications" ON public.loan_applications;

CREATE POLICY "Authenticated users can submit loan applications"
ON public.loan_applications
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = user_id) OR (user_id IS NULL)
);