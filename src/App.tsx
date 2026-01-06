import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
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
import AdminSetup from "./pages/AdminSetup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./pages/AdminSettings";
import AdminLoanApplications from "./pages/AdminLoanApplications";
import AdminUsers from "./pages/AdminUsers";
import AdminUserQueries from "./pages/AdminUserQueries";
import AdminRatingsReviews from "./pages/AdminRatingsReviews";
import AdminLoanProducts from "./pages/AdminLoanProducts";
import AdminBankPartners from "./pages/AdminBankPartners";
import AdminBlog from "./pages/AdminBlog";
import AdminFinancialGuides from "./pages/AdminFinancialGuides";
import AdminCareers from "./pages/AdminCareers";
import AdminPress from "./pages/AdminPress";
import AdminLayout from "./components/AdminLayout";
import MaintenanceWrapper from "./components/MaintenanceWrapper";
import LoanAdvisorChat from "./components/LoanAdvisorChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin routes - not affected by maintenance mode */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="loan-applications" element={<AdminLoanApplications status="all" />} />
            <Route path="loan-applications/new" element={<AdminLoanApplications status="pending" />} />
            <Route path="loan-applications/approved" element={<AdminLoanApplications status="approved" />} />
            <Route path="loan-applications/rejected" element={<AdminLoanApplications status="rejected" />} />
            <Route path="loan-applications/records" element={<AdminLoanApplications status="all" />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="user-queries" element={<AdminUserQueries />} />
            <Route path="ratings-reviews" element={<AdminRatingsReviews />} />
            <Route path="loan-products" element={<AdminLoanProducts />} />
            <Route path="bank-partners" element={<AdminBankPartners />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="financial-guides" element={<AdminFinancialGuides />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="press" element={<AdminPress />} />
          </Route>
          
          {/* Public routes - wrapped with maintenance mode */}
          <Route path="/*" element={
            <MaintenanceWrapper>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
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
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MaintenanceWrapper>
          } />
        </Routes>
        {/* Global floating chatbot */}
        <LoanAdvisorChat />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
