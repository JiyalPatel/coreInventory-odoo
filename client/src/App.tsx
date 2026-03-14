import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import WarehousesPage from "@/pages/WarehousesPage";
import LocationsPage from "@/pages/LocationsPage";
import ProductsPage from "@/pages/ProductsPage";
import OperationsPage from "@/pages/OperationsPage";
import MoveHistoryPage from "@/pages/MoveHistoryPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import VerifyOtpPage from "@/pages/VerifyOtpPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import TransferPage from "@/pages/TransferPage";
import StockLedgerPage from "@/pages/StockLedgerPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/warehouses" element={<WarehousesPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/operations" element={<OperationsPage />} />
              <Route path="/transfers" element={<TransferPage />} />
              <Route path="/stock-ledger" element={<StockLedgerPage />} />
              <Route path="/move-history" element={<MoveHistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
