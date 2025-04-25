
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TripProvider } from "./contexts/TripContext";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import TripDetails from "./pages/Trip/TripDetails";
import Photos from "./pages/Trip/Photos";
import Locations from "./pages/Trip/Locations";
import Expenses from "./pages/Trip/Expenses";
import Hotels from "./pages/Trip/Hotels";
import Friends from "./pages/Trip/Friends";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TripProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/trip/:tripId" element={<TripDetails />} />
                <Route path="/trip/:tripId/photos" element={<Photos />} />
                <Route path="/trip/:tripId/locations" element={<Locations />} />
                <Route path="/trip/:tripId/expenses" element={<Expenses />} />
                <Route path="/trip/:tripId/hotels" element={<Hotels />} />
                <Route path="/trip/:tripId/friends" element={<Friends />} />
                
                {/* Redirect to dashboard if user is already logged in */}
                <Route path="/login" element={<Navigate to="/dashboard" />} />
                <Route path="/register" element={<Navigate to="/dashboard" />} />
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TripProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
