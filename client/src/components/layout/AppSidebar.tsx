import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  Truck,
  ArrowLeftRight,
  ClipboardCheck,
  History,
  Settings,
  User,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Box,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Products", icon: Package, path: "/products" },
  {
    title: "Operations",
    icon: Box,
    children: [
      { title: "Receipts", icon: ArrowDownToLine, path: "/receipts" },
      { title: "Delivery Orders", icon: Truck, path: "/delivery-orders" },
      { title: "Internal Transfers", icon: ArrowLeftRight, path: "/internal-transfers" },
      { title: "Inventory Adjustments", icon: ClipboardCheck, path: "/inventory-adjustments" },
    ],
  },
  { title: "Move History", icon: History, path: "/move-history" },
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "Profile", icon: User, path: "/profile" },
];

export function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();
  const [opsOpen, setOpsOpen] = useState(true);

  const isActive = (path: string) => location.pathname === path;
  const isOpsActive = navItems
    .find((n) => n.title === "Operations")
    ?.children?.some((c) => location.pathname === c.path);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-screen flex flex-col border-r border-border bg-sidebar overflow-hidden flex-shrink-0"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Box className="text-primary-foreground" size={18} />
              </div>
              <span className="font-bold text-lg tracking-tight">CoreInventory</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Box className="text-primary-foreground" size={18} />
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.title}>
                <button
                  onClick={() => !collapsed && setOpsOpen(!opsOpen)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isOpsActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon size={18} strokeWidth={1.5} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${opsOpen ? "rotate-0" : "-rotate-90"}`}
                      />
                    </>
                  )}
                </button>
                <AnimatePresence>
                  {opsOpen && !collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 pl-3 border-l border-border space-y-1 mt-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors relative ${
                              isActive(child.path)
                                ? "text-primary bg-primary/10 font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                          >
                            <child.icon size={16} strokeWidth={1.5} />
                            <span>{child.title}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                isActive(item.path!)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {isActive(item.path!) && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={18} strokeWidth={1.5} className="relative z-10" />
              {!collapsed && <span className="relative z-10">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-border">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </motion.aside>
  );
}
