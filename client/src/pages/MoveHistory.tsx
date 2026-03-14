import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const moves = [
  { id: 1, date: "2026-03-14 14:32", ref: "WH/IN/00042", product: "Widget Pro X", from: "Supplier Zone", to: "Main / Shelf A3", qty: 100, type: "Receipt" },
  { id: 2, date: "2026-03-14 13:10", ref: "WH/OUT/00108", product: "Sensor Module A", from: "East / Rack B1", to: "Customer", qty: 25, type: "Delivery" },
  { id: 3, date: "2026-03-14 11:45", ref: "WH/INT/00033", product: "Cable Assembly B", from: "Main / Bin C7", to: "East / Rack D2", qty: 50, type: "Transfer" },
  { id: 4, date: "2026-03-13 16:20", ref: "ADJ/00015", product: "Widget Pro X", from: "Main / Shelf A3", to: "Main / Shelf A3", qty: -5, type: "Adjustment" },
  { id: 5, date: "2026-03-13 14:00", ref: "WH/OUT/00107", product: "Motor Controller", from: "South / Zone D", to: "Customer", qty: 12, type: "Delivery" },
  { id: 6, date: "2026-03-13 10:30", ref: "WH/IN/00041", product: "PCB Board Rev3", from: "Supplier Zone", to: "West / Shelf E1", qty: 200, type: "Receipt" },
  { id: 7, date: "2026-03-12 15:00", ref: "WH/INT/00032", product: "Display Module 7in", from: "East / Rack B1", to: "West / Shelf E3", qty: 30, type: "Transfer" },
  { id: 8, date: "2026-03-12 09:45", ref: "ADJ/00014", product: "Sensor Module A", from: "East / Rack B1", to: "East / Rack B1", qty: 4, type: "Adjustment" },
];

export default function MoveHistory() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = moves.filter((m) => {
    const matchSearch = m.product.toLowerCase().includes(search.toLowerCase()) || m.ref.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || m.type.toLowerCase() === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Move History" description="Complete stock movement ledger" />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by product or ref..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px] h-9 text-sm">
            <Filter size={14} className="mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="receipt">Receipt</SelectItem>
            <SelectItem value="delivery">Delivery</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline + Table hybrid */}
      <div className="rounded-xl border border-border bg-card/70 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">From</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">To</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Qty</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <motion.tr key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3.5 text-xs text-muted-foreground font-mono">{m.date}</td>
                  <td className="px-4 py-3.5 text-sm font-mono font-medium">{m.ref}</td>
                  <td className="px-4 py-3.5 text-sm">{m.product}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{m.from}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{m.to}</td>
                  <td className={`px-4 py-3.5 text-sm text-right tabular-nums font-semibold ${m.qty < 0 ? "text-destructive" : "text-foreground"}`}>
                    {m.qty > 0 ? `+${m.qty}` : m.qty}
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={m.type.toLowerCase()} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{filtered.length} movements</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground">1</button>
            <button className="px-3 py-1 rounded-md text-xs font-medium hover:bg-accent transition-colors">2</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
