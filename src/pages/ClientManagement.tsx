import ModulePlaceholder from "@/components/ModulePlaceholder";
import { Users } from "lucide-react";

export default function ClientManagement() {
  return (
    <ModulePlaceholder
      title="Client Management"
      subtitle="Central control panel for leads, projects, and deliverables."
      icon={Users}
      features={[
        "Lead & client tracking",
        "Project & audit management",
        "Proposal & contract tracking",
        "Follow-up scheduling",
        "Monthly retainer management",
      ]}
    />
  );
}
