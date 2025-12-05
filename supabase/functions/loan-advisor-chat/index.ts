import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Initialize Supabase client to fetch banks
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all banks from database
    const { data: banks, error: banksError } = await supabase
      .from('banks')
      .select('*');

    if (banksError) {
      console.error('Error fetching banks:', banksError);
    }

    // Fetch loan products and their questions
    const { data: loanProducts, error: loanProductsError } = await supabase
      .from('loan_products')
      .select('id, name, description')
      .eq('is_active', true);

    if (loanProductsError) {
      console.error('Error fetching loan products:', loanProductsError);
    }

    const { data: loanQuestions, error: questionsError } = await supabase
      .from('loan_product_questions')
      .select('*')
      .order('sequence_order', { ascending: true });

    if (questionsError) {
      console.error('Error fetching loan questions:', questionsError);
    }

    const banksData = banks || [];
    const loanProductsData = loanProducts || [];
    const loanQuestionsData = loanQuestions || [];

    // System prompt for the AI loan advisor
    const systemPrompt = `You are an expert AI loan advisor helping users find the best bank and loan for their needs.

Your job is to:
1. Ask the user 10-15 questions to understand their needs, including:
   - Personal details (name, age, employment status, occupation)
   - Financial details (monthly income, existing debts, credit score if known)
   - Bank preferences (location, preferred features, account types)
   - Loan details (loan amount needed, loan type/purpose, preferred interest rate range, loan term)

2. Ask questions conversationally, one or two at a time. Be friendly and professional.

3. After gathering all information, analyze the user's needs and compare them with available banks.

4. Recommend the TOP 3 most suitable banks with clear explanations.

Available banks in our database:
${JSON.stringify(banksData, null, 2)}

Available loan products:
${JSON.stringify(loanProductsData, null, 2)}

Loan product questions (for application process):
${JSON.stringify(loanQuestionsData, null, 2)}

When recommending banks, consider:
- Interest rates matching user's preferred range
- Bank features matching user's needs
- Location availability
- Account types offered
- Overall rating

Format your final recommendation clearly with:
- Bank name and rating
- Why it's suitable for the user
- Key features and benefits
- Interest rate information

IMPORTANT - LOAN APPLICATION WORKFLOW:
After giving recommendations, ALWAYS ask: "Would you like me to help you apply for a loan with any of these banks?"

If the user says YES or selects a bank to apply:
1. Ask which bank they want to proceed with (if not already specified)
2. Once bank is selected, say: "Great! I'll help you apply for the loan. I'll now ask you some questions to complete your application."
3. Ask ALL the questions from the loan_product_questions for the relevant loan type (e.g., Personal Loan, Home Loan, etc.) ONE BY ONE conversationally
4. After all questions are answered, ask the user to upload required documents:
   - "Now I need you to upload the following documents to complete your application:"
   - PAN Card
   - Aadhar Card
   - Income Certificate/Salary Slips
   - Bank Statements (last 3-6 months)
   - Address Proof
   - "Please go to your Profile page to upload these documents, then come back and let me know when done."
5. Once user confirms documents are uploaded, respond with:
   "🎉 Excellent! Your loan application has been successfully submitted to [Bank Name]! 
   
   We have received all your information and documents. Our team will review your application and you will receive a notification about the status of your loan application soon.
   
   Thank you for using our loan advisor service! Is there anything else I can help you with?"

Keep responses concise and friendly. Start by greeting the user and asking the first question.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("loan-advisor-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});