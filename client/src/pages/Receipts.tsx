import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Check, Clock, FileText, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const statusPipeline = ["Draft", "Waiting", "Ready", "Done"];

const receipts = [
  { id: "WH/IN/00042", supplier: "Acme Corp", products: 5, date: "2026-03-14", status: "Ready" },
  { id: "WH/IN/00041", supplier: "TechParts Ltd", products: 3, date: "2026-03-13", status: "Done" },
  { id: "WH/IN/00040", supplier: "GlobalSupply Co", products: 8, date: "2026-03-13", status: "Waiting" },
  { id: "WH/IN/00039", supplier: "Acme Corp", products: 2, date: "2026-03-12", status: "Draft" },
  { id: "WH/IN/00038", supplier: "FastParts Inc", products: 12, date: "2026-03-11", status: "Done" },
  { id: "WH/IN/00037", supplier: "TechParts Ltd", products: 6, date: "2026-03-10", status: "Canceled" },
];

export default function Receipts() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = receipts.filter((r) =>
    r.id.toLowerCase().includes(search.toLowerCase()) || r.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Receipts"
        description="Manage incoming goods and supplier deliveries"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Create Receipt
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Create New Receipt</DialogTitle></DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Supplier</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Acme Corp</option><option>TechParts Ltd</option><option>GlobalSupply Co</option><option>FastParts Inc</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Expected Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Products & Quantities</label>
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex gap-2">
                        <input placeholder="Product name" className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        <input type="number" placeholder="Qty" className="w-20 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                    ))}
                  </div>
                  <button type="button" className="text-xs text-primary hover:underline mt-2">+ Add another product</button>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Create Receipt</button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Status Pipeline */}
      <div className="flex items-center gap-2 p-4 rounded-xl border border-border bg-card/70 backdrop-blur-md overflow-x-auto">
        {statusPipeline.map((s, i) => {
          const count = receipts.filter((r) => r.status === s).length;
          const icons: Record<string, any> = { Draft: FileText, Waiting: Clock, Ready: Check, Done: Check };
          const Icon = icons[s] || FileText;
          return (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${count > 0 ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                <Icon size={14} />
                <span>{s}</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-xs tabular-nums">{count}</span>
              </div>
              {i < statusPipeline.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search receipts..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card/70 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Supplier</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">Products</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3.5 text-sm font-mono font-medium">{r.id}</td>
                  <td className="px-4 py-3.5 text-sm">{r.supplier}</td>
                  <td className="px-4 py-3.5 text-sm text-center tabular-nums">{r.products}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{r.date}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3.5 text-right">
                    {r.status === "Ready" && (
                      <button className="px-3 py-1.5 rounded-lg bg-success text-success-foreground text-xs font-medium hover:bg-success/90 transition-colors">
                        Validate
                      </button>
                    )}
                    {r.status === "Draft" && (
                      <button className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-accent transition-colors">
                        Confirm
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
