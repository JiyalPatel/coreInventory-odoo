import { useQuery } from "@tanstack/react-query";
import { productApi, moveHistoryApi, Product } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Search, BookOpen, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StockLedgerPage() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [ledgerOpen, setLedgerOpen] = useState(false);

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: prodData, isLoading: prodLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.list,
  });

  const { data: ledgerData, isLoading: ledgerLoading } = useQuery({
    queryKey: ["ledger", selectedProduct?._id],
    queryFn: () => moveHistoryApi.getLedger(selectedProduct!._id),
    enabled: !!selectedProduct,
  });

  const products = prodData?.products ?? [];
  const ledger = ledgerData?.ledger ?? [];

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.skuCode.toLowerCase().includes(search.toLowerCase())
  );

  function openLedger(product: Product) {
    setSelectedProduct(product);
    setLedgerOpen(true);
  }

  // Totals for summary cards
  const totalProducts = products.length;
  const totalOnHand = products.reduce((sum, p) => sum + p.onHand, 0);
  const totalFreeToUse = products.reduce((sum, p) => sum + p.freeToUse, 0);
  const totalValue = products.reduce((sum, p) => sum + p.onHand * p.unitCost, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stock Ledger</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Full inventory overview. Click any product to see its complete movement history.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Products</p>
            <p className="text-2xl font-bold mt-1">{totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total On Hand</p>
            <p className="text-2xl font-bold mt-1">{totalOnHand.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Free to Use</p>
            <p className="text-2xl font-bold mt-1">{totalFreeToUse.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Value</p>
            <p className="text-2xl font-bold mt-1">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Product summary table */}
      <Card>
        <CardContent className="p-0">
          {prodLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">On Hand</TableHead>
                  <TableHead className="text-right">Reserved</TableHead>
                  <TableHead className="text-right">Free to Use</TableHead>
                  <TableHead className="text-right">Stock Value</TableHead>
                  <TableHead className="w-20">Ledger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => {
                    const reserved = p.onHand - p.freeToUse;
                    const stockValue = p.onHand * p.unitCost;
                    return (
                      <TableRow key={p._id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>
                          <code className="text-xs font-mono text-muted-foreground">{p.skuCode}</code>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          ${p.unitCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-medium">{p.onHand}</TableCell>
                        <TableCell className="text-right">
                          {reserved > 0 ? (
                            <span className="text-amber-600 font-medium">{reserved}</span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn("font-medium", p.freeToUse === 0 ? "text-destructive" : "text-green-600")}>
                            {p.freeToUse}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          ${stockValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openLedger(p)}
                            title="View movement history"
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── Ledger detail dialog ─────────────────────────────────────────────── */}
      <Dialog open={ledgerOpen} onOpenChange={setLedgerOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span>{selectedProduct?.name}</span>
              <code className="text-xs font-mono text-muted-foreground font-normal">
                {selectedProduct?.skuCode}
              </code>
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              {/* Product snapshot */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">On Hand</p>
                  <p className="text-xl font-bold mt-1">{selectedProduct.onHand}</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Free to Use</p>
                  <p className={cn("text-xl font-bold mt-1", selectedProduct.freeToUse === 0 ? "text-destructive" : "text-green-600")}>
                    {selectedProduct.freeToUse}
                  </p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Stock Value</p>
                  <p className="text-xl font-bold mt-1">
                    ${(selectedProduct.onHand * selectedProduct.unitCost).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Movement history */}
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wide">
                  Movement History
                </h4>
                {ledgerLoading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : ledger.length === 0 ? (
                  <div className="text-center text-muted-foreground py-6 text-sm">
                    No movements recorded yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledger.map((entry: any) => (
                        <TableRow key={entry._id}>
                          <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                            {new Date(entry.movedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {entry.moveType === "IN" ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                                <ArrowUpCircle className="h-3.5 w-3.5" />IN
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-destructive text-sm font-medium">
                                <ArrowDownCircle className="h-3.5 w-3.5" />OUT
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs font-mono">{entry.operation?.reference}</code>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {entry.operation?.contact}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <span className={entry.moveType === "IN" ? "text-green-600" : "text-destructive"}>
                              {entry.moveType === "IN" ? "+" : "-"}{entry.quantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {entry.balance}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
