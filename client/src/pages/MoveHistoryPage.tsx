import { useQuery } from "@tanstack/react-query";
import { moveHistoryApi } from "@/lib/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MoveHistoryPage() {
  const [type, setType] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["move-history", type, search],
    queryFn: () => moveHistoryApi.list({ type: (type && type !== "all") ? type : undefined, search: search || undefined }),
  });

  const history = data?.history ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Move History</h1>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reference or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-32"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="IN">IN</SelectItem>
            <SelectItem value="OUT">OUT</SelectItem>
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
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No move history</TableCell></TableRow>
                ) : history.map((h) => (
                  <TableRow key={h._id}>
                    <TableCell className="font-medium">{h.operation.reference}</TableCell>
                    <TableCell>{h.product.name}</TableCell>
                    <TableCell>
                      <span className={cn("text-sm font-medium", h.moveType === "IN" ? "move-in" : "move-out")}>
                        {h.moveType}
                      </span>
                    </TableCell>
                    <TableCell className={cn(h.moveType === "IN" ? "move-in" : "move-out")}>
                      {h.moveType === "IN" ? "+" : "-"}{h.quantity}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(h.movedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {h.fromLocation?.fullCode} → {h.toLocation?.fullCode}
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
