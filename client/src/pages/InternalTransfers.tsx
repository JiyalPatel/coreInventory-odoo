import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const transfers = [
  { id: "WH/INT/00033", source: "Main Warehouse", dest: "East Hub", products: 3, date: "2026-03-14", status: "Ready" },
  { id: "WH/INT/00032", source: "East Hub", dest: "West Distribution", products: 5, date: "2026-03-13", status: "Done" },
  { id: "WH/INT/00031", source: "West Distribution", dest: "South Depot", products: 2, date: "2026-03-13", status: "Waiting" },
  { id: "WH/INT/00030", source: "Main Warehouse", dest: "South Depot", products: 8, date: "2026-03-12", status: "Draft" },
  { id: "WH/INT/00029", source: "South Depot", dest: "Main Warehouse", products: 4, date: "2026-03-11", status: "Done" },
];

export default function InternalTransfers() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const filtered = transfers.filter((t) =>
    t.id.toLowerCase().includes(search.toLowerCase()) || t.source.toLowerCase().includes(search.toLowerCase()) || t.dest.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Internal Transfers"
        description="Move inventory between warehouses"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus size={16} /> New Transfer
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Create Internal Transfer</DialogTitle></DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Source Warehouse</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Main Warehouse</option><option>East Hub</option><option>West Distribution</option><option>South Depot</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Destination Warehouse</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>East Hub</option><option>Main Warehouse</option><option>West Distribution</option><option>South Depot</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Products</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input placeholder="Product name" className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      <input type="number" placeholder="Qty" className="w-20 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <button type="button" className="text-xs text-primary hover:underline mt-2">+ Add product</button>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Create Transfer</button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transfers..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
      </div>

      <div className="rounded-xl border border-border bg-card/70 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Route</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">Products</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-mono font-medium">{t.id}</td>
                  <td className="px-4 py-3.5 text-sm">
                    <span className="text-muted-foreground">{t.source}</span>
                    <ArrowRight size={12} className="inline mx-2 text-muted-foreground" />
                    <span>{t.dest}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-center tabular-nums">{t.products}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{t.date}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3.5 text-right">
                    {t.status === "Ready" && (
                      <button className="px-3 py-1.5 rounded-lg bg-success text-success-foreground text-xs font-medium hover:bg-success/90 transition-colors">
                        Validate Transfer
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
