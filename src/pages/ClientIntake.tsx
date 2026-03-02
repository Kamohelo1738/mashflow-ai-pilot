import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const industries = [
  "Law Firm", "Construction", "Professional Services", "SME", "Retail",
  "Restaurant", "Property", "Medical Practice", "Logistics", "Other"
];

const budgetRanges = [
  "Under R10,000", "R10,000 – R25,000", "R25,000 – R50,000",
  "R50,000 – R100,000", "R100,000 – R250,000", "R250,000+"
];

const companySizes = [
  "1–5 employees", "6–20 employees", "21–50 employees",
  "51–100 employees", "101–500 employees", "500+ employees"
];

export default function ClientIntake() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    clientName: "", companyName: "", email: "", phone: "",
    industry: "", companySize: "", revenueRange: "",
    services: "", tools: "", processes: "",
    painPoints: "", goals: "", budget: "", timeline: "",
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const steps = [
    {
      title: "Contact Details",
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Client Name</Label><Input placeholder="Full name" value={form.clientName} onChange={e => update("clientName", e.target.value)} /></div>
            <div><Label>Company Name</Label><Input placeholder="Company name" value={form.companyName} onChange={e => update("companyName", e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" placeholder="email@company.co.za" value={form.email} onChange={e => update("email", e.target.value)} /></div>
            <div><Label>Phone</Label><Input placeholder="071 000 0000" value={form.phone} onChange={e => update("phone", e.target.value)} /></div>
          </div>
        </div>
      ),
    },
    {
      title: "Business Profile",
      fields: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Industry</Label>
              <Select value={form.industry} onValueChange={v => update("industry", v)}>
                <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Company Size</Label>
              <Select value={form.companySize} onValueChange={v => update("companySize", v)}>
                <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent>{companySizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Current Services / Products</Label><Textarea placeholder="Describe what your company offers..." value={form.services} onChange={e => update("services", e.target.value)} /></div>
          <div><Label>Existing Tools & Software</Label><Textarea placeholder="E.g. Excel, Sage, WhatsApp, custom systems..." value={form.tools} onChange={e => update("tools", e.target.value)} /></div>
        </div>
      ),
    },
    {
      title: "Operations & Pain Points",
      fields: (
        <div className="space-y-4">
          <div><Label>Operational Processes</Label><Textarea placeholder="Describe how your company operates day-to-day..." rows={4} value={form.processes} onChange={e => update("processes", e.target.value)} /></div>
          <div><Label>Key Pain Points & Bottlenecks</Label><Textarea placeholder="What's slowing you down or costing you money?" rows={4} value={form.painPoints} onChange={e => update("painPoints", e.target.value)} /></div>
        </div>
      ),
    },
    {
      title: "Goals & Budget",
      fields: (
        <div className="space-y-4">
          <div><Label>Growth Goals</Label><Textarea placeholder="What does success look like for you in 6–12 months?" rows={3} value={form.goals} onChange={e => update("goals", e.target.value)} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Budget Range</Label>
              <Select value={form.budget} onValueChange={v => update("budget", v)}>
                <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                <SelectContent>{budgetRanges.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Desired Timeline</Label><Input placeholder="E.g. 4 weeks, 3 months" value={form.timeline} onChange={e => update("timeline", e.target.value)} /></div>
          </div>
        </div>
      ),
    },
  ];

  const handleSubmit = async () => {
    if (!form.clientName || !form.companyName) { toast.error("Name and company are required"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("clients").insert([{
      client_name: form.clientName,
      company_name: form.companyName,
      email: form.email || null,
      phone: form.phone || null,
      industry: form.industry || null,
      company_size: form.companySize || null,
      services: form.services || null,
      tools: form.tools || null,
      processes: form.processes || null,
      pain_points: form.painPoints || null,
      goals: form.goals || null,
      budget: form.budget || null,
      timeline: form.timeline || null,
      status: "lead",
    }]);
    setSubmitting(false);
    if (error) { toast.error("Failed to save client"); return; }
    toast.success("Client saved! Redirecting to clients...");
    navigate("/clients");
  };

  return (
    <AppLayout>
      <PageHeader title="Client Intake" subtitle="Capture client details and generate a business profile." />

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              i === step
                ? "bg-primary text-primary-foreground"
                : i < step
                ? "bg-primary/20 text-primary"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">{i + 1}</span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-border bg-card p-6 shadow-elevated"
      >
        <h2 className="font-display text-xl font-semibold text-foreground mb-5">{steps[step].title}</h2>
        {steps[step].fields}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting} className="bg-gradient-gold text-primary-foreground hover:opacity-90">
              {submitting ? "Saving..." : "Complete Intake"}
            </Button>
          )}
        </div>
      </motion.div>
    </AppLayout>
  );
}
