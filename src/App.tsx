import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SettingsPage from "./SettingsPage";
import Features from "./components/landing/Features";
import HowItWorks from "./components/landing/HowItWorks";
import AIModels from "./components/landing/AIModels";

const queryClient = new QueryClient();

const appRoutes=[
  { path: "/", element: <Index /> },
  { path: "/settings", element: <SettingsPage /> },
  {path:"/features", element: <Features />},
  {path:"/how-it-works", element: <HowItWorks />},
  {path:"/ai-models", element: <AIModels />},
  {path: "*", element: <NotFound /> },
]

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          {appRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
