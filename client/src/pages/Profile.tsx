import { motion } from "framer-motion";
import { User, Mail, Lock, LogOut, Shield } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

export default function Profile() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <PageHeader title="Profile" description="Manage your account settings" />

      {/* Profile Card */}
      <div className="p-6 rounded-xl border border-border bg-card/70 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">JD</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">John Doe</h3>
            <p className="text-sm text-muted-foreground">Warehouse Manager</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="p-6 rounded-xl border border-border bg-card/70 backdrop-blur-md space-y-4">
        <h3 className="font-semibold flex items-center gap-2"><User size={16} /> Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
            <input defaultValue="John Doe" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <input defaultValue="john@coreinventory.com" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Role</label>
            <input disabled value="Warehouse Manager" className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm text-muted-foreground" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Warehouse</label>
            <input disabled value="Main Warehouse" className="w-full px-3 py-2 rounded-lg border border-border bg-muted text-sm text-muted-foreground" />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Update Profile
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="p-6 rounded-xl border border-border bg-card/70 backdrop-blur-md space-y-4">
        <h3 className="font-semibold flex items-center gap-2"><Lock size={16} /> Change Password</h3>
        <div className="space-y-3 max-w-sm">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Current Password</label>
            <input type="password" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">New Password</label>
            <input type="password" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Confirm New Password</label>
            <input type="password" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Update Password
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/5 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-destructive flex items-center gap-2"><LogOut size={16} /> Sign Out</h3>
            <p className="text-sm text-muted-foreground mt-1">End your current session</p>
          </div>
          <button className="px-4 py-2 rounded-lg border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
}
