import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import { motion } from "framer-motion";
import { Users, FileText, Zap, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const quickActions = [
  { label: "New Client Intake", path: "/intake", icon: Users },
  { label: "Generate Audit", path: "/audit", icon: FileText },
  { label: "Automation Solutions", path: "/automation", icon: Zap },
  { label: "Create Proposal", path: "/documents", icon: FileText },
];

const recentActivity = [
  { text: "Client intake completed — Thabo Construction", time: "2 hours ago" },
  { text: "AI audit generated — Kgosi Law Partners", time: "5 hours ago" },
  { text: "Proposal sent — Bright Retail Group", time: "1 day ago" },
  { text: "Workshop designed — MediCare Admin", time: "2 days ago" },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <PageHeader title="Dashboard" subtitle="Welcome back, Kamohelo. Here's your operations overview." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Clients" value={12} icon={<Users size={20} />} trend="+3 this month" />
        <MetricCard label="Audits Completed" value={28} icon={<FileText size={20} />} trend="+5 this month" />
        <MetricCard label="Automations Live" value={47} icon={<Zap size={20} />} trend="+8 this month" />
        <MetricCard label="Monthly Revenue" value="R185K" icon={<DollarSign size={20} />} trend="+12% vs last month" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 shadow-elevated"
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.path}
                to={a.path}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm font-medium text-secondary-foreground transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/30 group"
              >
                <a.icon size={16} />
                <span className="flex-1">{a.label}</span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 shadow-elevated"
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1">
                  <p className="text-foreground">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
