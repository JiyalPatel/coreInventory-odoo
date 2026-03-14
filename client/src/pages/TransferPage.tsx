import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transferApi, warehouseApi, productApi, Operation } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Search, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
    draft: "status-badge-draft",
    ready: "status-badge-ready",
    waiting: "status-badge-waiting",
    done: "status-badge-done",
    cancelled: "status-badge-cancelled",
};

type LineForm = { product: string; quantity: string };

const emptyForm = () => ({
    fromWarehouse: "",
    toWarehouse: "",
    scheduleDate: "",
    lines: [{ product: "", quantity: "" }] as LineForm[],
});

export default function TransferPage() {
    const qc = useQueryClient();

    const [search, setSearch] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [form, setForm] = useState(emptyForm());

    // ── Queries ────────────────────────────────────────────────────────────────
    const { data, isLoading } = useQuery({
        queryKey: ["transfers", search],
        queryFn: () => transferApi.list({ search: search || undefined }),
    });

    const { data: whData } = useQuery({
        queryKey: ["warehouses"],
        queryFn: warehouseApi.list,
    });
    const { data: prodData } = useQuery({
        queryKey: ["products"],
        queryFn: productApi.list,
    });

    // ── Mutation ───────────────────────────────────────────────────────────────
    const createMut = useMutation({
        mutationFn: transferApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["transfers"] });
            qc.invalidateQueries({ queryKey: ["operations"] });
            qc.invalidateQueries({ queryKey: ["products"] });
            toast.success("Transfer created — two draft operations generated");
            setCreateOpen(false);
            setForm(emptyForm());
        },
        onError: (e: Error) => toast.error(e.message),
    });

    // ── Handlers ───────────────────────────────────────────────────────────────
    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        createMut.mutate({
            fromWarehouse: form.fromWarehouse,
            toWarehouse: form.toWarehouse,
            scheduleDate: form.scheduleDate,
            lines: form.lines
                .filter((l) => l.product && l.quantity)
                .map((l) => ({
                    product: l.product,
                    quantity: parseInt(l.quantity),
                })),
        });
    }

    const addLine = () =>
        setForm({
            ...form,
            lines: [...form.lines, { product: "", quantity: "" }],
        });
    const removeLine = (idx: number) =>
        setForm({ ...form, lines: form.lines.filter((_, i) => i !== idx) });
    const updateLine = (
        idx: number,
        field: "product" | "quantity",
        value: string,
    ) => {
        const lines = [...form.lines];
        lines[idx] = { ...lines[idx], [field]: value };
        setForm({ ...form, lines });
    };

    const operations = data?.operations ?? [];
    const warehouses = whData?.warehouses ?? [];
    const products = prodData?.products ?? [];

    // Get source warehouse name for the selected fromWarehouse
    const srcWarehouse = warehouses.find((w) => w._id === form.fromWarehouse);
    const dstWarehouse = warehouses.find((w) => w._id === form.toWarehouse);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Warehouse Transfers</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Move stock between warehouses. Creates a paired OUT + IN
                        operation.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setForm(emptyForm());
                        setCreateOpen(true);
                    }}
                >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    New Transfer
                </Button>
            </div>

            {/* Search */}
            <div className="flex gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search transfers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 w-64"
                    />
                </div>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Warehouse</TableHead>
                                    <TableHead>Delivery / Notes</TableHead>
                                    <TableHead>Schedule Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {operations.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="text-center text-muted-foreground py-8"
                                        >
                                            No transfers found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    operations.map((op) => (
                                        <TableRow key={op._id}>
                                            <TableCell className="font-medium font-mono text-sm">
                                                {op.reference}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={cn(
                                                        "text-sm font-medium",
                                                        op.type === "IN"
                                                            ? "move-in"
                                                            : "move-out",
                                                    )}
                                                >
                                                    {op.type === "IN"
                                                        ? "Receiving"
                                                        : "Dispatching"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {op.contact}
                                            </TableCell>
                                            <TableCell>
                                                {op.warehouse.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {op.deliveryAddress || "—"}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(
                                                    op.scheduleDate,
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs",
                                                        statusStyles[op.status],
                                                    )}
                                                >
                                                    {op.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
                After creating a transfer, go to <strong>Operations</strong> to
                mark each leg ready and validate them.
            </p>

            {/* ── Create dialog ────────────────────────────────────────────────────── */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>New Warehouse Transfer</DialogTitle>
                    </DialogHeader>

                    {/* Visual route indicator */}
                    {(srcWarehouse || dstWarehouse) && (
                        <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
                            <span className="font-medium">
                                {srcWarehouse?.name ?? "Source"}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-medium">
                                {dstWarehouse?.name ?? "Destination"}
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>From Warehouse</Label>
                                <Select
                                    value={form.fromWarehouse}
                                    onValueChange={(v) =>
                                        setForm({ ...form, fromWarehouse: v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select source" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses
                                            .filter(
                                                (w) =>
                                                    w._id !== form.toWarehouse,
                                            )
                                            .map((w) => (
                                                <SelectItem
                                                    key={w._id}
                                                    value={w._id}
                                                >
                                                    {w.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>To Warehouse</Label>
                                <Select
                                    value={form.toWarehouse}
                                    onValueChange={(v) =>
                                        setForm({ ...form, toWarehouse: v })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select destination" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouses
                                            .filter(
                                                (w) =>
                                                    w._id !==
                                                    form.fromWarehouse,
                                            )
                                            .map((w) => (
                                                <SelectItem
                                                    key={w._id}
                                                    value={w._id}
                                                >
                                                    {w.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Schedule Date</Label>
                            <Input
                                type="date"
                                value={form.scheduleDate}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        scheduleDate: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Products to Transfer</Label>
                            {form.lines.map((line, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-2 items-center"
                                >
                                    <Select
                                        value={line.product}
                                        onValueChange={(v) =>
                                            updateLine(idx, "product", v)
                                        }
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((p) => (
                                                <SelectItem
                                                    key={p._id}
                                                    value={p._id}
                                                >
                                                    {p.name} ({p.skuCode}) —{" "}
                                                    {p.onHand} on hand
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="Qty"
                                        value={line.quantity}
                                        onChange={(e) =>
                                            updateLine(
                                                idx,
                                                "quantity",
                                                e.target.value,
                                            )
                                        }
                                        className="w-20"
                                    />
                                    {form.lines.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeLine(idx)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addLine}
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Product
                            </Button>
                        </div>

                        <div className="rounded-md border border-muted bg-muted/40 p-3 text-xs text-muted-foreground">
                            This will create two draft operations:
                            <br />•{" "}
                            <span className="text-destructive font-medium">
                                OUT
                            </span>{" "}
                            from {srcWarehouse?.name ?? "source"}
                            <br />•{" "}
                            <span className="text-green-600 font-medium">
                                IN
                            </span>{" "}
                            to {dstWarehouse?.name ?? "destination"}
                            <br />
                            Go to Operations to validate each one.
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={
                                createMut.isPending ||
                                !form.fromWarehouse ||
                                !form.toWarehouse
                            }
                        >
                            {createMut.isPending
                                ? "Creating..."
                                : "Create Transfer"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
