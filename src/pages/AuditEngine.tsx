import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SearchCheck, Loader2, Save, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { streamEdgeFunction } from "@/lib/streamChat";
import { toast } from "sonner";

interface Client {
  id: string;
  client_name: string;
  company_name: string;
  email: string | null;
  phone: string | null;
  industry: string | null;
  company_size: string | null;
  services: string | null;
  tools: string | null;
  processes: string | null;
  pain_points: string | null;
  goals: string | null;
  budget: string | null;
  timeline: string | null;
}

export default function AuditEngine() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cid = params.get("clientId");
    if (cid) setSelectedClientId(cid);

    supabase.from("clients").select("*").order("company_name").then(({ data }) => {
      if (data) setClients(data as Client[]);
    });
  }, []);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const generateAudit = async () => {
    if (!selectedClient) { toast.error("Select a client first"); return; }
    setGenerating(true);
    setReport("");

    await streamEdgeFunction({
      functionName: "generate-audit",
      body: { client: selectedClient },
      onDelta: (text) => setReport(prev => prev + text),
      onDone: () => {
        setGenerating(false);
        toast.success("Audit report generated!");
      },
      onError: (err) => {
        setGenerating(false);
        toast.error(err);
      },
    });
  };

  const saveAudit = async () => {
    if (!selectedClient || !report) return;
    setSaving(true);
    const { error } = await supabase.from("audits").insert([{
      client_id: selectedClient.id,
      title: `AI Audit — ${selectedClient.company_name}`,
      report_content: report,
      summary: report.substring(0, 500),
      status: "completed",
    }]);
    setSaving(false);
    if (error) { toast.error("Failed to save audit"); return; }
    toast.success("Audit saved to database!");
  };

  return (
    <AppLayout>
      <PageHeader title="AI Business Audit Engine" subtitle="Generate comprehensive AI audit reports from client data." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-elevated space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Select Client</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger><SelectValue placeholder="Choose a client..." /></SelectTrigger>
                <SelectContent>
                  {clients.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.company_name} — {c.client_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedClient && (
              <div className="text-xs space-y-1.5 text-muted-foreground">
                <p><span className="text-foreground font-medium">Industry:</span> {selectedClient.industry || "—"}</p>
                <p><span className="text-foreground font-medium">Size:</span> {selectedClient.company_size || "—"}</p>
                <p><span className="text-foreground font-medium">Pain Points:</span> {selectedClient.pain_points?.substring(0, 100) || "—"}</p>
              </div>
            )}

            <Button onClick={generateAudit} disabled={!selectedClient || generating} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
              {generating ? <><Loader2 size={16} className="mr-2 animate-spin" />Generating...</> : <><SearchCheck size={16} className="mr-2" />Generate Audit</>}
            </Button>

            {report && (
              <Button onClick={saveAudit} disabled={saving} variant="outline" className="w-full">
                {saving ? <><Loader2 size={16} className="mr-2 animate-spin" />Saving...</> : <><Save size={16} className="mr-2" />Save to Database</>}
              </Button>
            )}
          </div>
        </motion.div>

        {/* Report */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-elevated min-h-[500px]">
            {!report && !generating ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <SearchCheck size={32} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Ready to Audit</h3>
                <p className="text-muted-foreground text-sm max-w-md">Select a client and click "Generate Audit" to produce a comprehensive AI business transformation report.</p>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-body">
                  {report}
                  {generating && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
