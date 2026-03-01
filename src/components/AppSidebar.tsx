import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  SearchCheck,
  GitBranch,
  Globe,
  Zap,
  FileText,
  GraduationCap,
  Users,
  FlaskConical,
  DollarSign,
  Menu,
  X,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/intake", label: "Client Intake", icon: UserPlus },
  { path: "/audit", label: "AI Audit Engine", icon: SearchCheck },
  { path: "/workflows", label: "Workflow Design", icon: GitBranch },
  { path: "/software", label: "Software Planning", icon: Globe },
  { path: "/automation", label: "Automation Solutions", icon: Zap },
  { path: "/documents", label: "Document Generator", icon: FileText },
  { path: "/workshops", label: "Workshop Designer", icon: GraduationCap },
  { path: "/clients", label: "Client Management", icon: Users },
  { path: "/rnd", label: "R&D Lab", icon: FlaskConical },
  { path: "/pricing", label: "Pricing & Revenue", icon: DollarSign },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-card text-foreground"
      >
        {collapsed ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-64"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
          <div className="h-9 w-9 rounded-lg bg-gradient-gold flex items-center justify-center font-display font-bold text-primary-foreground text-lg">
            M
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground leading-none">Mash</h1>
            <p className="text-xs text-muted-foreground tracking-widest uppercase">Automations</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {modules.map((m) => (
            <NavLink
              key={m.path}
              to={m.path}
              onClick={() => setCollapsed(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === m.path
                  ? "bg-primary/10 text-primary shadow-gold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <m.icon size={18} />
              <span>{m.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone size={12} />
            <span>071 155 1290</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 opacity-60">Operated by Kamohelo</p>
        </div>
      </aside>
    </>
  );
}
