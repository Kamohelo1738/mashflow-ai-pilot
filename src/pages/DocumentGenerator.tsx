import ModulePlaceholder from "@/components/ModulePlaceholder";
import { FileText } from "lucide-react";

export default function DocumentGenerator() {
  return (
    <ModulePlaceholder
      title="Document Generator"
      subtitle="Create professional business documents and communications."
      icon={FileText}
      features={[
        "Project proposals",
        "Scope of work documents",
        "Service agreements",
        "Client reports",
        "Professional emails & templates",
      ]}
    />
  );
}
