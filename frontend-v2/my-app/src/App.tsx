import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "./components/ui/sidebar";
import Register from "./app/dashboard/Register";
import Manage from "./app/dashboard/Manage";
import Search from "./app/dashboard/Search";
import Dashboard from "./app/dashboard/Dashboard";
import { Toaster } from "sonner";


function App() {
  return (
    <Router>
      <Toaster />
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
          <Route path="/manage" element={<Manage />} />
        </Routes>
      </SidebarProvider>
    </Router>
  )
}

export default App
