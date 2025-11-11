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

    const banksData = banks || [];

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