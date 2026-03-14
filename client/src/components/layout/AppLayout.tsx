import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Warehouse,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/operations?type=IN", icon: ArrowDownToLine, label: "Receipts" },
  { to: "/operations?type=OUT", icon: ArrowUpFromLine, label: "Delivery" },
  { to: "/transfers", icon: ArrowLeftRight, label: "Transfers" },
  { to: "/warehouses", icon: Warehouse, label: "Warehouses" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/stock-ledger", icon: BookOpen, label: "Stock Ledger" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <Package className="h-6 w-6 text-sidebar-primary shrink-0" />
        {!collapsed && <span className="text-lg font-bold text-sidebar-foreground">CoreInventory</span>}
      </div>
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const isOperationLink = item.to.startsWith("/operations");
          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => {
                const active = isOperationLink
                  ? window.location.pathname === "/operations" && window.location.search.includes(item.to.split("?")[1])
                  : isActive && !window.location.search;
                return cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                );
              }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-2">
        {!collapsed && user && (
          <div className="mb-2 px-3 py-1">
            <p className="text-xs font-medium text-sidebar-foreground">{user.loginId}</p>
            <p className="text-xs text-sidebar-muted">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transition-transform md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute right-2 top-3">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
            <X className="h-4 w-4 text-sidebar-foreground" />
          </Button>
        </div>
        {sidebarContent}
      </aside>

      {/* Sidebar desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-4 -right-3 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-card border shadow-sm hover:bg-accent"
          style={{ left: collapsed ? "52px" : "248px" }}
        >
          <ChevronLeft className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}