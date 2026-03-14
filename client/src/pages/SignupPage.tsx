import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ loginId: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await authApi.signup(form);
      toast.success("Registration successful! Your account is pending admin approval.");
      navigate("/login");
    } catch (err) {
      if (err instanceof ApiError && err.errors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => { fieldErrors[e.field] = e.message; });
        setErrors(fieldErrors);
      } else {
        toast.error(err instanceof ApiError ? err.message : "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Sign up for CoreInventory</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: "loginId", label: "Login ID", type: "text", placeholder: "6-12 alphanumeric chars" },
              { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
              { id: "password", label: "Password", type: "password", placeholder: "Min 8 chars, upper, lower, special" },
              { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Re-enter password" },
            ].map((f) => (
              <div key={f.id} className="space-y-2">
                <Label htmlFor={f.id}>{f.label}</Label>
                <Input
                  id={f.id}
                  type={f.type}
                  value={form[f.id as keyof typeof form]}
                  onChange={update(f.id)}
                  placeholder={f.placeholder}
                  required
                />
                {errors[f.id] && <p className="text-sm text-destructive">{errors[f.id]}</p>}
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
