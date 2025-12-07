import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Workspace Pages
import Overview from "./pages/workspace/Overview";
import Products from "./pages/workspace/Products";
import Calculator from "./pages/workspace/Calculator";
import Files from "./pages/workspace/Files";
import AITools from "./pages/workspace/AITools";
import Reports from "./pages/workspace/Reports";
import ToDoList from "./pages/workspace/Todolist";
import Stock from "./pages/workspace/Stock";
import OCRPage from "./pages/workspace/OCR";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, role, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Auth initializer component
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthInitializer>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Workspace Routes */}
            <Route
              path="/workspace/:businessId"
              element={
                <ProtectedRoute>
                  <Workspace />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="products" element={<Products />} />
              <Route path="calculator" element={<Calculator />} />
              <Route path="files" element={<Files />} />
              <Route path="ai" element={<AITools />} />
              <Route path="reports" element={<Reports />} />
              <Route path="todo" element={<ToDoList />} />
              <Route path="stock" element={<Stock />} />
              <Route path="ocr" element={<OCRPage />} />
          
            </Route>
            
            {/* Admin Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthInitializer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
