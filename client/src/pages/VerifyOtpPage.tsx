import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed via router state from ForgotPasswordPage; fall back to manual entry
  const [email, setEmail] = useState<string>(location.state?.email ?? "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const { resetToken } = await authApi.verifyOtp({ email, otp });
      toast.success("OTP verified!");
      navigate("/reset-password", { state: { resetToken } });
    } catch (err) {
      if (err instanceof ApiError && err.errors.length > 0) {
        toast.error(err.errors[0].message);
      } else {
        toast.error(err instanceof ApiError ? err.message : "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    setResending(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success("New OTP sent!");
      setOtp("");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Enter OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Show email field only if not passed via router state */}
            {!location.state?.email && (
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            )}

            {location.state?.email && (
              <p className="text-center text-sm text-muted-foreground">
                Sent to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            )}

            <div className="space-y-2">
              <Label>One-time password</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              {resending ? "Resending..." : "Didn't get it? Resend OTP"}
            </button>
          </div>

          <p className="mt-3 text-center text-sm text-muted-foreground">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <ArrowLeft className="h-3 w-3" />
              Back
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
