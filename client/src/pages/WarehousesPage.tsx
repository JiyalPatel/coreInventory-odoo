import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { warehouseApi, Warehouse } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function WarehousesPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [form, setForm] = useState({ name: "", shortCode: "", address: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["warehouses"],
    queryFn: warehouseApi.list,
  });

  const createMut = useMutation({
    mutationFn: () => warehouseApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["warehouses"] }); toast.success("Warehouse created"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: () => warehouseApi.update(editing!._id, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["warehouses"] }); toast.success("Warehouse updated"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: warehouseApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["warehouses"] }); toast.success("Warehouse deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  function openCreate() {
    setEditing(null);
    setForm({ name: "", shortCode: "", address: "" });
    setOpen(true);
  }

  function openEdit(w: Warehouse) {
    setEditing(w);
    setForm({ name: w.name, shortCode: w.shortCode, address: w.address });
    setOpen(true);
  }

  function close() { setOpen(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    editing ? updateMut.mutate() : createMut.mutate();
  }

  const warehouses = data?.warehouses ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Warehouses</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Warehouse</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Warehouse" : "New Warehouse"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Short Code (2-5 chars)</Label>
                <Input value={form.shortCode} onChange={(e) => setForm({ ...form, shortCode: e.target.value.toUpperCase() })} maxLength={5} required />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <Button type="submit" className="w-full" disabled={createMut.isPending || updateMut.isPending}>
                {editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Short Code</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No warehouses yet</TableCell></TableRow>
                ) : warehouses.map((w) => (
                  <TableRow key={w._id}>
                    <TableCell className="font-medium">{w.name}</TableCell>
                    <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{w.shortCode}</code></TableCell>
                    <TableCell className="text-muted-foreground">{w.address || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(w)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMut.mutate(w._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
