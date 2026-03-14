import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownToLine, ArrowUpFromLine, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.get,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const receipts = data?.receipts;
  const deliveries = data?.deliveries;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Receipts Card */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/operations?type=IN")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Receipt</CardTitle>
            <ArrowDownToLine className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{receipts?.operations ?? 0}</p>
                <p className="text-xs text-muted-foreground">To Receive</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{receipts?.total ?? 0}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{receipts?.late ?? 0}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" /> Late
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deliveries Card */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate("/operations?type=OUT")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Delivery</CardTitle>
            <ArrowUpFromLine className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold">{deliveries?.operations ?? 0}</p>
                <p className="text-xs text-muted-foreground">To Deliver</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{deliveries?.total ?? 0}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{deliveries?.late ?? 0}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" /> Late
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{deliveries?.waiting ?? 0}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Waiting
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
