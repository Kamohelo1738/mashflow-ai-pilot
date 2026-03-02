import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { client } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an elite AI business transformation consultant for Mash Automations, a premium South African AI automation agency. You produce detailed, professional business audit reports.

Your audits must:
- Be structured with clear sections and headers (use markdown)
- Identify operational inefficiencies with specific examples
- Highlight manual workload hotspots
- Find communication gaps
- Identify revenue leakage points
- Suggest cost reduction opportunities
- Identify customer experience weaknesses
- Recommend specific automation opportunities
- Quantify impact: time savings, productivity gains, potential revenue improvements
- Be professional, actionable, and realistic for South African businesses
- Use Rand (R) for any monetary references
- End with a prioritized implementation roadmap

Format the report with these sections:
1. Executive Summary
2. Company Overview
3. Operational Analysis
4. Key Findings & Pain Points
5. Automation Opportunities
6. Impact Quantification (time & cost savings)
7. Risk Assessment
8. Recommended Solutions
9. Implementation Roadmap
10. Investment & ROI Estimate`;

    const userPrompt = `Generate a comprehensive AI business audit report for the following client:

Company: ${client.company_name}
Contact: ${client.client_name}
Industry: ${client.industry || "Not specified"}
Company Size: ${client.company_size || "Not specified"}
Services/Products: ${client.services || "Not specified"}
Current Tools: ${client.tools || "Not specified"}
Operational Processes: ${client.processes || "Not specified"}
Pain Points: ${client.pain_points || "Not specified"}
Goals: ${client.goals || "Not specified"}
Budget: ${client.budget || "Not specified"}
Timeline: ${client.timeline || "Not specified"}

Produce a thorough, professional audit report with quantified recommendations.`;

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
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up in Settings → Workspace → Usage." }), {
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
    console.error("generate-audit error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
