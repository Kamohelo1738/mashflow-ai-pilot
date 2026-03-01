import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ModulePlaceholderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  features: string[];
}

export default function ModulePlaceholder({ title, subtitle, icon: Icon, features }: ModulePlaceholderProps) {
  return (
    <AppLayout>
      <PageHeader title={title} subtitle={subtitle} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border bg-card p-8 shadow-elevated text-center max-w-2xl mx-auto"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
          <Icon size={32} />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{subtitle}</p>

        <div className="text-left space-y-2 bg-secondary/50 rounded-lg p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Planned Features</p>
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-secondary-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {f}
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6">This module is being developed. Enable Lovable Cloud to unlock full functionality.</p>
      </motion.div>
    </AppLayout>
  );
}
