import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-[60%] bg-primary/5 dark:bg-primary/10 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-success/5" />
        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
              <Box className="text-primary-foreground" size={32} />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Start managing smarter.</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Join thousands of businesses that trust CoreInventory for their warehouse operations.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Box className="text-primary-foreground" size={18} />
            </div>
            <span className="font-bold text-lg">CoreInventory</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-1">Create account</h1>
          <p className="text-muted-foreground mb-8">Get started with CoreInventory</p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="relative">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder=" "
                className="peer w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
              <label className="absolute left-4 top-3 text-sm text-muted-foreground transition-all peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90 origin-left pointer-events-none">
                Full name
              </label>
            </div>
            <div className="relative">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" "
                className="peer w-full px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
              <label className="absolute left-4 top-3 text-sm text-muted-foreground transition-all peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90 origin-left pointer-events-none">
                Email address
              </label>
            </div>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" "
                className="peer w-full px-4 py-3 pr-10 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
              <label className="absolute left-4 top-3 text-sm text-muted-foreground transition-all peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90 origin-left pointer-events-none">
                Password
              </label>
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" className="w-full h-11 px-8 bg-primary hover:bg-primary/90 transition-all rounded-lg text-primary-foreground font-medium text-sm">
              Create account
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
