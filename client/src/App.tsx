import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "@/components/app-shell";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import { NetworkNavigatorLanding, RoadmapView, Step1, Step2, Step3, Step4 } from "@/pages/network-navigator";
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
                <Route path="/mock-interview" element={<Navigate to="/" replace />} />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
