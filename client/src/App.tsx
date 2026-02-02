import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "@/components/app-shell";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import MockInterview from "@/pages/mock-interview";
import { NetworkNavigatorLanding, RoadmapView, RoadmapWizard } from "@/pages/network-navigator";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <HashRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mock-interview" element={<MockInterview />} />
              <Route path="/network-navigator" element={<NetworkNavigatorLanding />} />
              <Route path="/network-navigator/wizard/step-:step" element={<RoadmapWizard />} />
              <Route path="/network-navigator/roadmap/:id" element={<RoadmapView />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
