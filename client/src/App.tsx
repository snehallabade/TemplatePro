import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import Templates from "@/pages/templates";
import Generator from "@/pages/generator";
import GeneratedPdfs from "@/pages/generated-pdfs";
import UserGuide from "@/pages/user-guide";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";

function Router() {
  // Temporarily bypass authentication for demo purposes
  const mockUser = {
    id: 'demo-user',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User'
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/templates" component={Templates} />
          <Route path="/generator/:templateId?" component={Generator} />
          <Route path="/generated-pdfs" component={GeneratedPdfs} />
          <Route path="/user-guide" component={UserGuide} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
