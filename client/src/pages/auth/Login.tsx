import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left illustration */}
      <div className="hidden lg:flex lg:w-[60%] bg-primary/5 dark:bg-primary/10 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-20" viewBox="0 0 800 600">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.rect
                key={i}
                x={50 + (i % 5) * 160}
                y={50 + Math.floor(i / 5) * 140}
                width={120}
                height={100}
                rx={12}
                fill="none"
                stroke="hsl(239 84% 67%)"
                strokeWidth={1}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.95, 1, 0.95] }}
                transition={{ duration: 3, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.line
                key={`l-${i}`}
                x1={110 + (i % 5) * 160}
                y1={150 + Math.floor(i / 5) * 140}
                x2={110 + ((i % 5) + 1) * 160}
                y2={50 + (Math.floor(i / 5) + 1) * 140}
                stroke="hsl(239 84% 67%)"
                strokeWidth={0.5}
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, repeatType: "reverse" }}
              />
            ))}
          </svg>
        </div>
        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
              <Box className="text-primary-foreground" size={32} />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Logistics, synchronized.</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Real-time inventory tracking, warehouse management, and supply chain intelligence in one platform.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Box className="text-primary-foreground" size={18} />
            </div>
            <span className="font-bold text-lg">CoreInventory</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to your account</p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
              <label className="absolute left-4 top-3 text-sm text-muted-foreground transition-all peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90 origin-left pointer-events-none">
                Email address
              </label>
            </div>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer w-full px-4 py-3 pr-10 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
              <label className="absolute left-4 top-3 text-sm text-muted-foreground transition-all peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90 origin-left pointer-events-none">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/reset-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full h-11 px-8 bg-primary hover:bg-primary/90 transition-all rounded-lg text-primary-foreground font-medium text-sm"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
