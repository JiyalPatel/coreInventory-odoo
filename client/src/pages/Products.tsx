import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const products = [
  { id: 1, name: "Widget Pro X", sku: "WPX-001", category: "Electronics", warehouse: "Main", stock: 245, status: "In Stock" },
  { id: 2, name: "Sensor Module A", sku: "SMA-042", category: "Sensors", warehouse: "East", stock: 8, status: "Low Stock" },
  { id: 3, name: "Cable Assembly B", sku: "CAB-019", category: "Cables", warehouse: "Main", stock: 532, status: "In Stock" },
  { id: 4, name: "PCB Board Rev3", sku: "PCB-003", category: "Electronics", warehouse: "West", stock: 0, status: "Out of Stock" },
  { id: 5, name: "Power Supply Unit", sku: "PSU-112", category: "Power", warehouse: "Main", stock: 89, status: "In Stock" },
  { id: 6, name: "Connector Set D", sku: "CSD-067", category: "Connectors", warehouse: "East", stock: 15, status: "Low Stock" },
  { id: 7, name: "Motor Controller", sku: "MCT-008", category: "Motors", warehouse: "South", stock: 156, status: "In Stock" },
  { id: 8, name: "Display Module 7in", sku: "DM7-024", category: "Displays", warehouse: "Main", stock: 42, status: "In Stock" },
];

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog and stock levels"
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus size={16} /> Add Product
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }} className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Product Name</label>
                  <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Enter product name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">SKU</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="SKU-000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      {categories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Warehouse</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Main</option><option>East</option><option>West</option><option>South</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Initial Stock</label>
                    <input type="number" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="0" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Create Product</button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <Filter size={14} className="mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card/70 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Warehouse</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Stock</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors group"
                >
                  <td className="px-4 py-3.5 text-sm font-medium">{p.name}</td>
                  <td className="px-4 py-3.5 text-sm font-mono text-muted-foreground">{p.sku}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{p.warehouse}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold tabular-nums text-right">{p.stock}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1.5 rounded-md hover:bg-accent transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye size={14} className="mr-2" /> View Details</DropdownMenuItem>
                        <DropdownMenuItem><Edit size={14} className="mr-2" /> Edit Product</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 size={14} className="mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{filtered.length} of {products.length} products</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground">1</button>
            <button className="px-3 py-1 rounded-md text-xs font-medium hover:bg-accent transition-colors">2</button>
            <button className="px-3 py-1 rounded-md text-xs font-medium hover:bg-accent transition-colors">3</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
