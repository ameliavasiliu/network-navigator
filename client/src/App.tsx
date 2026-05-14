import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "@/components/app-shell";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ContactsPage from "@/pages/contacts";
import CompaniesPage from "@/pages/companies";
import { LoginPage, SignupPage, RequireAuth } from "@/pages/auth";
import { NetworkNavigatorLanding, RoadmapView, Step1, Step2, Step3, Step4 } from "@/pages/network-navigator";
import { RoadmapProvider } from "@/context/roadmap-context";
import { AuthProvider } from "@/context/auth-context";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <RoadmapProvider>
            <HashRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route element={<RequireAuth><AppShell /></RequireAuth>}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Navigate to="/" replace />} />
                  <Route path="/mock-interview" element={<Navigate to="/" replace />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/companies" element={<CompaniesPage />} />
                  <Route path="/network-navigator" element={<NetworkNavigatorLanding />} />
                  <Route path="/network-navigator/create/step-1" element={<Step1 />} />
                  <Route path="/network-navigator/create/step-2" element={<Step2 />} />
                  <Route path="/network-navigator/create/step-3" element={<Step3 />} />
                  <Route path="/network-navigator/create/step-4" element={<Step4 />} />
                  <Route path="/network-navigator/:roadmapId" element={<RoadmapView />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </HashRouter>
          </RoadmapProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
