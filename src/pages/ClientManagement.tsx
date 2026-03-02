import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Search, Eye, Trash2, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Client {
  id: string;
  client_name: string;
  company_name: string;
  email: string | null;
  phone: string | null;
  industry: string | null;
  company_size: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  lead: "bg-info/20 text-info",
  active: "bg-success/20 text-success",
  completed: "bg-muted text-muted-foreground",
  paused: "bg-warning/20 text-warning",
};

const industries = [
  "Law Firm", "Construction", "Professional Services", "SME", "Retail",
  "Restaurant", "Property", "Medical Practice", "Logistics", "Other"
];

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ client_name: "", company_name: "", email: "", phone: "", industry: "", company_size: "", status: "lead" });

  const fetchClients = async () => {
    const { data, error } = await supabase.from("clients").select("id, client_name, company_name, email, phone, industry, company_size, status, created_at").order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load clients"); return; }
    setClients(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const addClient = async () => {
    if (!form.client_name || !form.company_name) { toast.error("Name and company are required"); return; }
    const { error } = await supabase.from("clients").insert([form]);
    if (error) { toast.error("Failed to add client"); return; }
    toast.success("Client added");
    setDialogOpen(false);
    setForm({ client_name: "", company_name: "", email: "", phone: "", industry: "", company_size: "", status: "lead" });
    fetchClients();
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Client removed");
    fetchClients();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("clients").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    fetchClients();
  };

  const filtered = clients.filter(c =>
    c.client_name.toLowerCase().includes(search.toLowerCase()) ||
    c.company_name.toLowerCase().includes(search.toLowerCase())
  );

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <AppLayout>
      <PageHeader title="Client Management" subtitle="Track leads, clients, and projects." />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-gold text-primary-foreground hover:opacity-90"><Plus size={16} className="mr-2" />Add Client</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Client Name *</Label><Input value={form.client_name} onChange={e => update("client_name", e.target.value)} /></div>
                <div><Label>Company *</Label><Input value={form.company_name} onChange={e => update("company_name", e.target.value)} /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => update("email", e.target.value)} /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={e => update("phone", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Industry</Label>
                  <Select value={form.industry} onValueChange={v => update("industry", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => update("status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addClient} className="w-full bg-gradient-gold text-primary-foreground">Save Client</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Industry</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No clients found. Add your first client above.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{c.client_name}</div>
                    <div className="text-xs text-muted-foreground">{c.company_name}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{c.industry || "—"}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="text-xs text-muted-foreground">{c.email || "—"}</div>
                    <div className="text-xs text-muted-foreground">{c.phone || ""}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Select value={c.status} onValueChange={v => updateStatus(c.id, v)}>
                      <SelectTrigger className="h-7 w-28 text-xs border-0 p-0">
                        <Badge className={`${statusColors[c.status] || ""} text-xs`}>{c.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Link to={`/audit?clientId=${c.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><FileText size={14} /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteClient(c.id)}><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AppLayout>
  );
}
