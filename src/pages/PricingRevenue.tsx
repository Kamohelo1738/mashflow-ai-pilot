import ModulePlaceholder from "@/components/ModulePlaceholder";
import { DollarSign } from "lucide-react";

export default function PricingRevenue() {
  return (
    <ModulePlaceholder
      title="Pricing & Revenue"
      subtitle="Generate recommended pricing guidance for services."
      icon={DollarSign}
      features={[
        "AI audit pricing",
        "Implementation project costing",
        "Website build estimates",
        "Automation package pricing",
        "Workshop & retainer pricing",
      ]}
    />
  );
}
