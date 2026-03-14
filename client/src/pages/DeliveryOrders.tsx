import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, PackageCheck, PackageOpen, Truck as TruckIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";

const deliveries = [
  { id: "WH/OUT/00108", customer: "RetailMax Inc", items: 4, date: "2026-03-14", status: "Ready", step: "Pack" },
  { id: "WH/OUT/00107", customer: "SmartStore Ltd", items: 7, date: "2026-03-14", status: "Waiting", step: "Pick" },
  { id: "WH/OUT/00106", customer: "DistroHub Co", items: 2, date: "2026-03-13", status: "Done", step: "Delivered" },
  { id: "WH/OUT/00105", customer: "RetailMax Inc", items: 10, date: "2026-03-13", status: "Done", step: "Delivered" },
  { id: "WH/OUT/00104", customer: "QuickShip LLC", items: 3, date: "2026-03-12", status: "Draft", step: "Pick" },
  { id: "WH/OUT/00103", customer: "SmartStore Ltd", items: 6, date: "2026-03-11", status: "Canceled", step: "-" },
];

const steps = [
  { label: "Pick Items", icon: PackageOpen },
  { label: "Pack Items", icon: PackageCheck },
  { label: "Validate", icon: TruckIcon },
];

export default function DeliveryOrders() {
  const [search, setSearch] = useState("");
  const filtered = deliveries.filter((d) =>
    d.id.toLowerCase().includes(search.toLowerCase()) || d.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Delivery Orders"
        description="Manage outgoing shipments and deliveries"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Create Delivery
          </button>
        }
      />

      {/* Steps visual */}
      <div className="flex items-center gap-2 p-4 rounded-xl border border-border bg-card/70 backdrop-blur-md">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground">
              <s.icon size={16} />
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deliveries..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
      </div>

      <div className="rounded-xl border border-border bg-card/70 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">Items</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Step</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <motion.tr key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-mono font-medium">{d.id}</td>
                  <td className="px-4 py-3.5 text-sm">{d.customer}</td>
                  <td className="px-4 py-3.5 text-sm text-center tabular-nums">{d.items}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{d.step}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{d.date}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3.5 text-right">
                    {d.status === "Ready" && (
                      <button className="px-3 py-1.5 rounded-lg bg-success text-success-foreground text-xs font-medium hover:bg-success/90 transition-colors">
                        Validate Delivery
                      </button>
                    )}
                    {d.status === "Waiting" && (
                      <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
                        Start Packing
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
