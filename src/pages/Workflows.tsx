import ModulePlaceholder from "@/components/ModulePlaceholder";
import { GitBranch } from "lucide-react";

export default function Workflows() {
  return (
    <ModulePlaceholder
      title="Workflow Design"
      subtitle="Transform current processes into optimized workflows."
      icon={GitBranch}
      features={[
        "Current process mapping",
        "Bottleneck identification",
        "Optimized workflow proposals",
        "Human vs automated task definitions",
        "Implementation roadmap",
      ]}
    />
  );
}
