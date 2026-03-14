import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Warehouse, MapPin, Edit, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const warehouses = [
  { id: 1, name: "Main Warehouse", code: "WH-MAIN", address: "123 Industrial Blvd, Chicago", locations: 24, products: 1250 },
  { id: 2, name: "East Hub", code: "WH-EAST", address: "456 Commerce Dr, New York", locations: 16, products: 820 },
  { id: 3, name: "West Distribution", code: "WH-WEST", address: "789 Logistics Ave, Los Angeles", locations: 12, products: 640 },
  { id: 4, name: "South Depot", code: "WH-SOUTH", address: "321 Supply Rd, Houston", locations: 8, products: 390 },
];

export default function SettingsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage warehouses and system configuration"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Add Warehouse
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Create New Warehouse</DialogTitle></DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Warehouse Name</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="e.g. North Distribution" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Code</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="WH-NORTH" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Address</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Full address" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Create Warehouse</button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warehouses.map((wh, i) => (
          <motion.div
            key={wh.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="p-6 rounded-xl border border-border bg-card/70 backdrop-blur-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <Warehouse size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{wh.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{wh.code}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-md hover:bg-accent transition-colors"><Edit size={14} className="text-muted-foreground" /></button>
                <button className="p-1.5 rounded-md hover:bg-accent transition-colors"><Trash2 size={14} className="text-destructive" /></button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin size={14} />
              <span>{wh.address}</span>
            </div>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Locations</span>
                <p className="font-semibold tabular-nums">{wh.locations}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Products</span>
                <p className="font-semibold tabular-nums">{wh.products}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
