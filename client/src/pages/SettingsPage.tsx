import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pending-users"],
    queryFn: authApi.pendingUsers,
    enabled: user?.role === "admin",
  });

  const approveMut = useMutation({
    mutationFn: authApi.approve,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["pending-users"] }); toast.success("User approved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const rejectMut = useMutation({
    mutationFn: authApi.reject,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["pending-users"] }); toast.success("User rejected"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const pendingUsers = data?.users ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader><CardTitle>Account Info</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><span className="text-muted-foreground">Login ID:</span> {user?.loginId}</div>
          <div><span className="text-muted-foreground">Email:</span> {user?.email}</div>
          <div><span className="text-muted-foreground">Role:</span> {user?.role}</div>
        </CardContent>
      </Card>

      {user?.role === "admin" && (
        <Card>
          <CardHeader><CardTitle>Pending User Approvals</CardTitle></CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Login ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No pending users</TableCell></TableRow>
                  ) : pendingUsers.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell className="font-medium">{u.loginId}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => approveMut.mutate(u._id)} disabled={approveMut.isPending}>
                            <Check className="h-4 w-4 text-success" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => rejectMut.mutate(u._id)} disabled={rejectMut.isPending}>
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
