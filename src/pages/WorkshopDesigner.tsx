import ModulePlaceholder from "@/components/ModulePlaceholder";
import { GraduationCap } from "lucide-react";

export default function WorkshopDesigner() {
  return (
    <ModulePlaceholder
      title="Workshop Designer"
      subtitle="Generate customized AI workshop plans for client organizations."
      icon={GraduationCap}
      features={[
        "Executive AI strategy sessions",
        "Staff productivity training",
        "Curriculum outlines & agendas",
        "Learning outcome definitions",
        "Implementation workshops",
      ]}
    />
  );
}
