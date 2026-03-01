import ModulePlaceholder from "@/components/ModulePlaceholder";
import { Globe } from "lucide-react";

export default function SoftwarePlanning() {
  return (
    <ModulePlaceholder
      title="Software & Website Planning"
      subtitle="Generate specifications for tailored digital solutions."
      icon={Globe}
      features={[
        "Conversion-focused website structure",
        "Lead capture & booking systems",
        "Internal app feature planning",
        "Technical architecture overview",
        "Implementation phases",
      ]}
    />
  );
}
