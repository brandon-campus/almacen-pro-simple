import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalProvider } from "./context/GlobalContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Caja from "./pages/Caja";
import Stock from "./pages/Stock";
import Gastos from "./pages/Gastos";
import Resumen from "./pages/Resumen";
import Consejero from "./pages/Consejero";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GlobalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/caja" element={<ProtectedRoute><Caja /></ProtectedRoute>} />
            <Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
            <Route path="/gastos" element={<ProtectedRoute><Gastos /></ProtectedRoute>} />
            <Route path="/resumen" element={<ProtectedRoute><Resumen /></ProtectedRoute>} />
            <Route path="/consejero" element={<ProtectedRoute><Consejero /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
