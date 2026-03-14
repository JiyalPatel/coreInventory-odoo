import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi, Product } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProductsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", skuCode: "", unitCost: "" });
  const [stockValue, setStockValue] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["products"], queryFn: productApi.list });

  const createMut = useMutation({
    mutationFn: () => productApi.create({ ...form, unitCost: parseFloat(form.unitCost) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Product created"); closeForm(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: () => productApi.update(editing!._id, { ...form, unitCost: parseFloat(form.unitCost) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Product updated"); closeForm(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const stockMut = useMutation({
    mutationFn: () => productApi.updateStock(stockProduct!._id, parseInt(stockValue)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Stock updated"); setStockOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Product deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  function openCreate() { setEditing(null); setForm({ name: "", skuCode: "", unitCost: "" }); setOpen(true); }
  function openEdit(p: Product) { setEditing(p); setForm({ name: p.name, skuCode: p.skuCode, unitCost: p.unitCost.toString() }); setOpen(true); }
  function openStock(p: Product) { setStockProduct(p); setStockValue(p.onHand.toString()); setStockOpen(true); }
  function closeForm() { setOpen(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    editing ? updateMut.mutate() : createMut.mutate();
  }

  const products = data?.products ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>SKU Code</Label>
                <Input value={form.skuCode} onChange={(e) => setForm({ ...form, skuCode: e.target.value.toUpperCase() })} required />
              </div>
              <div className="space-y-2">
                <Label>Unit Cost</Label>
                <Input type="number" step="0.01" min="0" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full" disabled={createMut.isPending || updateMut.isPending}>
                {editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stock update dialog */}
      <Dialog open={stockOpen} onOpenChange={setStockOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Stock — {stockProduct?.name}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); stockMut.mutate(); }} className="space-y-4">
            <div className="space-y-2">
              <Label>On Hand Quantity</Label>
              <Input type="number" min="0" value={stockValue} onChange={(e) => setStockValue(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={stockMut.isPending}>Update Stock</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>On Hand</TableHead>
                  <TableHead>Free to Use</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No products yet</TableCell></TableRow>
                ) : products.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{p.skuCode}</code></TableCell>
                    <TableCell>${p.unitCost.toFixed(2)}</TableCell>
                    <TableCell>{p.onHand}</TableCell>
                    <TableCell>{p.freeToUse}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openStock(p)}>Stock</Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMut.mutate(p._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
