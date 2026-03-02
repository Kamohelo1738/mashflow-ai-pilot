import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import { motion } from "framer-motion";
import { Users, FileText, Zap, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const quickActions = [
  { label: "New Client Intake", path: "/intake", icon: Users },
  { label: "Generate Audit", path: "/audit", icon: FileText },
  { label: "Automation Solutions", path: "/automation", icon: Zap },
  { label: "Create Document", path: "/documents", icon: FileText },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ clients: 0, audits: 0, documents: 0 });
  const [recentClients, setRecentClients] = useState<{ client_name: string; company_name: string; created_at: string }[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from("clients").select("id", { count: "exact", head: true }),
      supabase.from("audits").select("id", { count: "exact", head: true }),
      supabase.from("documents").select("id", { count: "exact", head: true }),
      supabase.from("clients").select("client_name, company_name, created_at").order("created_at", { ascending: false }).limit(5),
    ]).then(([c, a, d, recent]) => {
      setMetrics({ clients: c.count || 0, audits: a.count || 0, documents: d.count || 0 });
      setRecentClients(recent.data || []);
    });
  }, []);

  return (
    <AppLayout>
      <PageHeader title="Dashboard" subtitle="Welcome back, Kamohelo. Here's your operations overview." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Clients" value={metrics.clients} icon={<Users size={20} />} />
        <MetricCard label="Audits Generated" value={metrics.audits} icon={<FileText size={20} />} />
        <MetricCard label="Documents Created" value={metrics.documents} icon={<FileText size={20} />} />
        <MetricCard label="Active Platform" value="Live" icon={<Zap size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 shadow-elevated">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link key={a.path} to={a.path} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm font-medium text-secondary-foreground transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/30 group">
                <a.icon size={16} />
                <span className="flex-1">{a.label}</span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="rounded-xl border border-border bg-card p-6 shadow-elevated">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Recent Clients</h2>
          <div className="space-y-3">
            {recentClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No clients yet. Start by adding your first client.</p>
            ) : recentClients.map((c, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-foreground font-medium">{c.client_name} — {c.company_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(c.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
