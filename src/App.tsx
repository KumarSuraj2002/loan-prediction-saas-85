
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import PressReleaseDetail from "./pages/PressReleaseDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import FinancialGuides from "./pages/FinancialGuides";
import GuidePost from "./pages/GuidePost";
import EMICalculator from "./pages/EMICalculator";
import APIDocumentation from "./pages/APIDocumentation";
import BankDetailsPage from "./pages/BankDetailsPage";
import LoanDetailsPage from "./pages/LoanDetailsPage";
import LoanApplication from "./pages/LoanApplication";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./components/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/press/:releaseId" element={<PressReleaseDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:postId" element={<BlogPost />} />
          <Route path="/guides" element={<FinancialGuides />} />
          <Route path="/guides/:guideId" element={<GuidePost />} />
          <Route path="/calculator" element={<EMICalculator />} />
          <Route path="/api-docs" element={<APIDocumentation />} />
          <Route path="/bank/:bankId" element={<BankDetailsPage />} />
          <Route path="/bank/:bankId/loan/:loanType" element={<LoanDetailsPage />} />
          <Route path="/loan-application" element={<LoanApplication />} />
          <Route path="/loan-application/:loanType" element={<LoanApplication />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
