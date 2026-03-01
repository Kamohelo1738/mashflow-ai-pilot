import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ClientIntake from "./pages/ClientIntake";
import AuditEngine from "./pages/AuditEngine";
import Workflows from "./pages/Workflows";
import SoftwarePlanning from "./pages/SoftwarePlanning";
import AutomationSolutions from "./pages/AutomationSolutions";
import DocumentGenerator from "./pages/DocumentGenerator";
import WorkshopDesigner from "./pages/WorkshopDesigner";
import ClientManagement from "./pages/ClientManagement";
import RnDLab from "./pages/RnDLab";
import PricingRevenue from "./pages/PricingRevenue";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/intake" element={<ClientIntake />} />
          <Route path="/audit" element={<AuditEngine />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/software" element={<SoftwarePlanning />} />
          <Route path="/automation" element={<AutomationSolutions />} />
          <Route path="/documents" element={<DocumentGenerator />} />
          <Route path="/workshops" element={<WorkshopDesigner />} />
          <Route path="/clients" element={<ClientManagement />} />
          <Route path="/rnd" element={<RnDLab />} />
          <Route path="/pricing" element={<PricingRevenue />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
