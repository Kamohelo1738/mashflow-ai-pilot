import ModulePlaceholder from "@/components/ModulePlaceholder";
import { FlaskConical } from "lucide-react";

export default function RnDLab() {
  return (
    <ModulePlaceholder
      title="R&D Lab"
      subtitle="Log discoveries, experiments, and future service concepts."
      icon={FlaskConical}
      features={[
        "New AI tools discovered",
        "Product idea logging",
        "Experiment results tracking",
        "Industry opportunity analysis",
        "Future service concepts",
      ]}
    />
  );
}
