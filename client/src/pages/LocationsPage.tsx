import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { locationApi, warehouseApi, Location } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LocationsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState({ name: "", shortCode: "", warehouse: "" });

  const { data, isLoading } = useQuery({ queryKey: ["locations"], queryFn: () => locationApi.list() });
  const { data: whData } = useQuery({ queryKey: ["warehouses"], queryFn: warehouseApi.list });

  const createMut = useMutation({
    mutationFn: () => locationApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["locations"] }); toast.success("Location created"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: () => locationApi.update(editing!._id, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["locations"] }); toast.success("Location updated"); close(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: locationApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["locations"] }); toast.success("Location deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });

  function openCreate() { setEditing(null); setForm({ name: "", shortCode: "", warehouse: "" }); setOpen(true); }
  function openEdit(l: Location) { setEditing(l); setForm({ name: l.name, shortCode: l.shortCode, warehouse: l.warehouse._id }); setOpen(true); }
  function close() { setOpen(false); setEditing(null); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    editing ? updateMut.mutate() : createMut.mutate();
  }

  const locations = data?.locations ?? [];
  const warehouses = whData?.warehouses ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Locations</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Location</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Location" : "New Location"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Warehouse</Label>
                <Select value={form.warehouse} onValueChange={(v) => setForm({ ...form, warehouse: v })}>
                  <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                  <SelectContent>
                    {warehouses.map((w) => <SelectItem key={w._id} value={w._id}>{w.name} ({w.shortCode})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Short Code</Label>
                <Input value={form.shortCode} onChange={(e) => setForm({ ...form, shortCode: e.target.value })} required />
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
                  <TableHead>Full Code</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No locations yet</TableCell></TableRow>
                ) : locations.map((l) => (
                  <TableRow key={l._id}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{l.fullCode}</code></TableCell>
                    <TableCell className="text-muted-foreground">{l.warehouse.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(l)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMut.mutate(l._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
