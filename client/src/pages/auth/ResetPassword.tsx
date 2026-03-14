import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "otp">("email");

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Box className="text-primary-foreground" size={18} />
          </div>
          <span className="font-bold text-lg">CoreInventory</span>
        </div>

        {step === "email" ? (
          <>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Reset password</h1>
            <p className="text-muted-foreground mb-8">Enter your email to receive a verification code</p>
            <form onSubmit={(e) => { e.preventDefault(); setStep("otp"); }} className="space-y-4">
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" "
                  className="peer w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
                <label className="absolute left-4 top-3 text-sm text-muted-foreground transition-all peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90 origin-left pointer-events-none">
                  Email address
                </label>
              </div>
              <button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 transition-all rounded-lg text-primary-foreground font-medium text-sm">
                Send verification code
              </button>
            </form>
          </>
        ) : (
          <>
            <button onClick={() => setStep("email")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft size={14} /> Back
            </button>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Enter verification code</h1>
            <p className="text-muted-foreground mb-8">We sent a code to {email}</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="flex gap-3 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 text-center text-lg font-semibold rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  />
                ))}
              </div>
              <button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 transition-all rounded-lg text-primary-foreground font-medium text-sm">
                Verify & Reset Password
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-sm text-center text-muted-foreground">
          Remember your password?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
