import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "./components/ui/sidebar";
import Register from "./app/dashboard/Register";
import Search from "./app/dashboard/Search";
import Dashboard from "./app/dashboard/Dashboard";
import Brands from "./app/dashboard/Brands";
import Login from "./app/dashboard/Login";
import VehicleDetail from "./app/dashboard/VehicleDetail";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom"

function AppContent() {
  const { token } = useAuth()
  const isLoggedIn = !!token

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/vehicles/:id" element={<VehicleDetail />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SidebarProvider>
  )
}

function App() {
  return (
    <Router>
      <Toaster />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}


export default App
