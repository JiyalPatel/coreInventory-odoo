import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Search, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

const adjustments = [
  { id: "ADJ/00015", product: "Widget Pro X", sku: "WPX-001", location: "Main / Shelf A3", system: 245, counted: 240, diff: -5 },
  { id: "ADJ/00014", product: "Sensor Module A", sku: "SMA-042", location: "East / Rack B1", system: 8, counted: 12, diff: 4 },
  { id: "ADJ/00013", product: "Cable Assembly B", sku: "CAB-019", location: "Main / Bin C7", system: 532, counted: 530, diff: -2 },
  { id: "ADJ/00012", product: "Motor Controller", sku: "MCT-008", location: "South / Zone D", system: 156, counted: 156, diff: 0 },
];

export default function InventoryAdjustment() {
  const [search, setSearch] = useState("");
  const filtered = adjustments.filter((a) =>
    a.product.toLowerCase().includes(search.toLowerCase()) || a.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Inventory Adjustments"
        description="Reconcile physical counts with system records"
        actions={
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <ClipboardCheck size={16} /> New Adjustment
          </button>
        }
      />

      {/* Form-like adjustment preview */}
      <div className="p-6 rounded-xl border border-border bg-card/70 backdrop-blur-md space-y-4">
        <h3 className="font-semibold text-sm">Quick Adjustment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Product</label>
            <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Select product...</option>
              <option>Widget Pro X</option><option>Sensor Module A</option><option>Cable Assembly B</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Location</label>
            <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Select location...</option>
              <option>Main / Shelf A3</option><option>East / Rack B1</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Counted Quantity</label>
            <input type="number" placeholder="0" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <RefreshCw size={14} /> Apply Adjustment
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search adjustments..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
      </div>

      <div className="rounded-xl border border-border bg-card/70 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Ref</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">System Qty</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Counted</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Difference</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <motion.tr key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-mono text-muted-foreground">{a.id}</td>
                  <td className="px-4 py-3.5 text-sm font-medium">{a.product}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{a.location}</td>
                  <td className="px-4 py-3.5 text-sm text-right tabular-nums">{a.system}</td>
                  <td className="px-4 py-3.5 text-sm text-right tabular-nums font-medium">{a.counted}</td>
                  <td className={`px-4 py-3.5 text-sm text-right tabular-nums font-semibold ${a.diff > 0 ? "text-success" : a.diff < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {a.diff > 0 ? `+${a.diff}` : a.diff}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
                      Confirm
                    </button>
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
