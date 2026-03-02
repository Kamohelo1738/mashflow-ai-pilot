import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Loader2, Save, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { streamEdgeFunction } from "@/lib/streamChat";
import { toast } from "sonner";

const docTypes = [
  { value: "proposal", label: "Project Proposal" },
  { value: "scope", label: "Scope of Work" },
  { value: "agreement", label: "Service Agreement" },
  { value: "report", label: "Client Report" },
  { value: "email", label: "Professional Email" },
];

interface Client {
  id: string;
  client_name: string;
  company_name: string;
}

export default function DocumentGenerator() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [docType, setDocType] = useState("proposal");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [content, setContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("clients").select("id, client_name, company_name").order("company_name").then(({ data }) => {
      if (data) setClients(data);
    });
  }, []);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const generate = async () => {
    setGenerating(true);
    setContent("");

    await streamEdgeFunction({
      functionName: "generate-document",
      body: {
        docType,
        clientName: selectedClient?.client_name || "",
        companyName: selectedClient?.company_name || "",
        details,
      },
      onDelta: (text) => setContent(prev => prev + text),
      onDone: () => {
        setGenerating(false);
        toast.success("Document generated!");
      },
      onError: (err) => {
        setGenerating(false);
        toast.error(err);
      },
    });
  };

  const save = async () => {
    if (!content) return;
    setSaving(true);
    const { error } = await supabase.from("documents").insert([{
      client_id: selectedClientId || null,
      title: title || `${docTypes.find(d => d.value === docType)?.label} — ${selectedClient?.company_name || "General"}`,
      doc_type: docType,
      content,
      status: "draft",
    }]);
    setSaving(false);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Document saved!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  return (
    <AppLayout>
      <PageHeader title="Document Generator" subtitle="Create professional business documents with AI." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-elevated space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Document Type</Label>
              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{docTypes.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Client (Optional)</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger><SelectValue placeholder="Select client..." /></SelectTrigger>
                <SelectContent>
                  {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Document title..." />
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Details & Requirements</Label>
              <Textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="Describe what you need in this document..." rows={5} />
            </div>

            <Button onClick={generate} disabled={generating} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
              {generating ? <><Loader2 size={16} className="mr-2 animate-spin" />Generating...</> : <><FileText size={16} className="mr-2" />Generate Document</>}
            </Button>

            {content && (
              <div className="flex gap-2">
                <Button onClick={save} disabled={saving} variant="outline" className="flex-1">
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} className="mr-1" />Save</>}
                </Button>
                <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                  <Copy size={14} className="mr-1" />Copy
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Document Output */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-elevated min-h-[500px]">
            {!content && !generating ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <FileText size={32} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Document Generator</h3>
                <p className="text-muted-foreground text-sm max-w-md">Choose a document type, optionally select a client, add details, and generate professional documents instantly.</p>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-body">
                  {content}
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
