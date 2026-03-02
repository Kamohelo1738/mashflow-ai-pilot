import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { docType, clientName, companyName, details } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const docTemplates: Record<string, string> = {
      proposal: "a detailed project proposal with scope, deliverables, timeline, investment, and terms",
      scope: "a scope of work document with objectives, deliverables, milestones, responsibilities, and acceptance criteria",
      agreement: "a professional service agreement with terms, conditions, payment schedule, and deliverables",
      report: "a client progress report with achievements, metrics, next steps, and recommendations",
      email: "a professional business email that is concise, clear, and action-oriented",
    };

    const template = docTemplates[docType] || "a professional business document";

    const systemPrompt = `You are a professional document writer for Mash Automations, a premium South African AI automation and business transformation agency run by Kamohelo (071 155 1290). 

Create polished, client-ready documents in markdown format. Use professional tone, clear structure, and specific details. Use Rand (R) for monetary values. Include Mash Automations branding context where appropriate.`;

    const userPrompt = `Create ${template} for:
Client: ${clientName || "Not specified"}
Company: ${companyName || "Not specified"}

Details/Requirements:
${details || "General document — use professional defaults and placeholders where specifics are needed."}

Make it thorough, professional, and ready for client presentation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("generate-document error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
