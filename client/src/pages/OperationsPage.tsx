import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { operationApi, warehouseApi, productApi, Operation, OperationLine, CreateOperationBody } from "@/lib/api";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Search, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  draft: "status-badge-draft",
  ready: "status-badge-ready",
  waiting: "status-badge-waiting",
  done: "status-badge-done",
  cancelled: "status-badge-cancelled",
};

export default function OperationsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const typeFilter = searchParams.get("type") || "";
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailOp, setDetailOp] = useState<{ operation: Operation; lines: OperationLine[] } | null>(null);
  const [form, setForm] = useState<{ type: "IN" | "OUT"; contact: string; scheduleDate: string; warehouse: string; deliveryAddress: string; lines: Array<{ product: string; quantity: string }> }>({
    type: (typeFilter as "IN" | "OUT") || "IN",
    contact: "",
    scheduleDate: "",
    warehouse: "",
    deliveryAddress: "",
    lines: [{ product: "", quantity: "" }],
  });

  const { data, isLoading } = useQuery({
    queryKey: ["operations", typeFilter, statusFilter, search],
    queryFn: () => operationApi.list({
      type: typeFilter || undefined,
      status: statusFilter || undefined,
      search: search || undefined,
    }),
  });

  const { data: whData } = useQuery({ queryKey: ["warehouses"], queryFn: warehouseApi.list });
  const { data: prodData } = useQuery({ queryKey: ["products"], queryFn: productApi.list });

  const createMut = useMutation({
    mutationFn: (body: CreateOperationBody) => operationApi.create(body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["operations"] }); toast.success("Operation created"); setCreateOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const todoMut = useMutation({
    mutationFn: operationApi.todo,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["operations"] });
      if (data.operation.status === "waiting") {
        toast.warning("Operation is waiting — insufficient stock for some items");
      } else {
        toast.success("Operation marked as ready");
      }
      setDetailOp(data);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const validateMut = useMutation({
    mutationFn: operationApi.validate,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["operations"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Operation validated — stock updated");
      setDetailOp(data);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelMut = useMutation({
    mutationFn: operationApi.cancel,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["operations"] });
      toast.success("Operation cancelled");
      setDetailOp({ operation: data.operation, lines: detailOp?.lines ?? [] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function openDetail(op: Operation) {
    try {
      const detail = await operationApi.get(op._id);
      setDetailOp(detail);
      setDetailOpen(true);
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createMut.mutate({
      type: form.type,
      contact: form.contact,
      scheduleDate: form.scheduleDate,
      warehouse: form.warehouse,
      deliveryAddress: form.deliveryAddress,
      lines: form.lines.filter(l => l.product && l.quantity).map(l => ({ product: l.product, quantity: parseInt(l.quantity) })),
    });
  }

  function addLine() {
    setForm({ ...form, lines: [...form.lines, { product: "", quantity: "" }] });
  }

  function removeLine(idx: number) {
    setForm({ ...form, lines: form.lines.filter((_, i) => i !== idx) });
  }

  function updateLine(idx: number, field: "product" | "quantity", value: string) {
    const lines = [...form.lines];
    lines[idx] = { ...lines[idx], [field]: value };
    setForm({ ...form, lines });
  }

  const operations = data?.operations ?? [];
  const warehouses = whData?.warehouses ?? [];
  const products = prodData?.products ?? [];
  const pageTitle = typeFilter === "IN" ? "Receipts" : typeFilter === "OUT" ? "Deliveries" : "Operations";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <Button onClick={() => { setForm({ ...form, type: (typeFilter as "IN" | "OUT") || "IN" }); setCreateOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />New {typeFilter === "IN" ? "Receipt" : typeFilter === "OUT" ? "Delivery" : "Operation"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-64" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {["draft", "ready", "waiting", "done", "cancelled"].map((s) => (
              <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  {!typeFilter && <TableHead>Type</TableHead>}
                  <TableHead>Contact</TableHead>
                  <TableHead>Schedule Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="w-20">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No operations</TableCell></TableRow>
                ) : operations.map((op) => (
                  <TableRow key={op._id}>
                    <TableCell className="font-medium font-mono text-sm">{op.reference}</TableCell>
                    {!typeFilter && <TableCell><span className={cn("text-sm font-medium", op.type === "IN" ? "move-in" : "move-out")}>{op.type}</span></TableCell>}
                    <TableCell>{op.contact}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(op.scheduleDate).toLocaleDateString()}</TableCell>
                    <TableCell><Badge variant="outline" className={cn("text-xs", statusStyles[op.status])}>{op.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{op.warehouse.name}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openDetail(op)}><Eye className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New {form.type === "IN" ? "Receipt" : "Delivery"}</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "IN" | "OUT" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">Receipt (IN)</SelectItem>
                    <SelectItem value="OUT">Delivery (OUT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Schedule Date</Label>
                <Input type="date" value={form.scheduleDate} onChange={(e) => setForm({ ...form, scheduleDate: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Contact</Label>
              <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Warehouse</Label>
              <Select value={form.warehouse} onValueChange={(v) => setForm({ ...form, warehouse: v })}>
                <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {form.type === "OUT" && (
              <div className="space-y-2">
                <Label>Delivery Address</Label>
                <Input value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Products</Label>
              {form.lines.map((line, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Select value={line.product} onValueChange={(v) => updateLine(idx, "product", v)}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent>
                      {products.map((p) => <SelectItem key={p._id} value={p._id}>{p.name} ({p.skuCode})</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input type="number" min="1" placeholder="Qty" value={line.quantity} onChange={(e) => updateLine(idx, "quantity", e.target.value)} className="w-20" />
                  {form.lines.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLine(idx)}><X className="h-4 w-4" /></Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addLine}><Plus className="h-3 w-3 mr-1" />Add Product</Button>
            </div>
            <Button type="submit" className="w-full" disabled={createMut.isPending}>
              {createMut.isPending ? "Creating..." : "Create Operation"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          {detailOp && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono">{detailOp.operation.reference}</span>
                  <Badge variant="outline" className={cn("text-xs", statusStyles[detailOp.operation.status])}>{detailOp.operation.status}</Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Type:</span> <span className={cn("font-medium", detailOp.operation.type === "IN" ? "move-in" : "move-out")}>{detailOp.operation.type}</span></div>
                  <div><span className="text-muted-foreground">Date:</span> {new Date(detailOp.operation.scheduleDate).toLocaleDateString()}</div>
                  <div><span className="text-muted-foreground">Contact:</span> {detailOp.operation.contact}</div>
                  <div><span className="text-muted-foreground">Warehouse:</span> {detailOp.operation.warehouse.name}</div>
                  {detailOp.operation.deliveryAddress && (
                    <div className="col-span-2"><span className="text-muted-foreground">Delivery:</span> {detailOp.operation.deliveryAddress}</div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Products</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Qty</TableHead>
                        {detailOp.operation.type === "OUT" && <TableHead>Short</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailOp.lines.map((line) => (
                        <TableRow key={line._id}>
                          <TableCell>{line.product.name}</TableCell>
                          <TableCell><code className="text-xs font-mono">{line.product.skuCode}</code></TableCell>
                          <TableCell>{line.quantity}</TableCell>
                          {detailOp.operation.type === "OUT" && (
                            <TableCell>{line.isShort ? <span className="text-destructive font-medium">Yes (On hand: {line.product.onHand})</span> : "No"}</TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex gap-2 justify-end">
                  {detailOp.operation.status === "draft" && (
                    <>
                      <Button variant="outline" onClick={() => cancelMut.mutate(detailOp.operation._id)} disabled={cancelMut.isPending}>Cancel</Button>
                      <Button onClick={() => todoMut.mutate(detailOp.operation._id)} disabled={todoMut.isPending}>Mark Ready</Button>
                    </>
                  )}
                  {detailOp.operation.status === "ready" && (
                    <>
                      <Button variant="outline" onClick={() => cancelMut.mutate(detailOp.operation._id)} disabled={cancelMut.isPending}>Cancel</Button>
                      <Button onClick={() => validateMut.mutate(detailOp.operation._id)} disabled={validateMut.isPending}>Validate</Button>
                    </>
                  )}
                  {detailOp.operation.status === "waiting" && (
                    <Button onClick={() => todoMut.mutate(detailOp.operation._id)} disabled={todoMut.isPending}>Retry (Check Stock)</Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
