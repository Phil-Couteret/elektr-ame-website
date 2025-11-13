
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContextNew";
import Index from "./pages/Index";
import Initiatives from "./pages/Initiatives";
import Contact from "./pages/Contact";
import JoinUs from "./pages/JoinUs";
import MemberLogin from "./pages/MemberLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";
import Admin from "./pages/Admin";
import MemberPortal from "./pages/MemberPortal";
import ArtistDetail from "./pages/ArtistDetail";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import PortalLayout from "./components/portal/PortalLayout";
import ConsultancyPage from "./pages/portal/ConsultancyPage";
import CompanyCreationPage from "./pages/portal/CompanyCreationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <PWAInstallPrompt />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/initiatives" element={<Initiatives />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/join-us" element={<JoinUs />} />
              <Route path="/member-login" element={<MemberLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/resend-verification" element={<ResendVerification />} />
              <Route path="/member-portal" element={<MemberPortal />} />
              <Route path="/artist/:id" element={<ArtistDetail />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              {/* Portal Routes */}
              <Route path="/portal" element={<PortalLayout />}>
                <Route index element={<Navigate to="/portal/consultancy" replace />} />
                <Route path="consultancy" element={<ConsultancyPage />} />
                <Route path="company-creation" element={<CompanyCreationPage />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
