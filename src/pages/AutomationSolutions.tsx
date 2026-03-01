import ModulePlaceholder from "@/components/ModulePlaceholder";
import { Zap } from "lucide-react";

export default function AutomationSolutions() {
  return (
    <ModulePlaceholder
      title="Automation Solutions"
      subtitle="Recommend high-ROI automation solutions for clients."
      icon={Zap}
      features={[
        "Workflow automations",
        "CRM & chatbot integrations",
        "AI voice agents",
        "Document & email automation",
        "Reporting dashboards",
      ]}
    />
  );
}
