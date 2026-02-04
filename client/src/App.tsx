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
import { RoadmapProvider } from "@/context/roadmap-context";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <RoadmapProvider>
          <HashRouter>
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />
                <Route path="/mock-interview" element={<MockInterview />} />
                
                {/* Network Navigator routes - order matters for matching */}
                <Route path="/network-navigator">
                  <Route index element={<NetworkNavigatorLanding />} />
                  <Route path="create" element={<Navigate to="step-1" replace />} />
                  <Route path="create/step-:step" element={<RoadmapWizard />} />
                  <Route path=":roadmapId" element={<RoadmapView />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </HashRouter>
        </RoadmapProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
