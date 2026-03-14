import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "destructive";
  sparkline?: number[];
}

export function KPICard({ label, value, trend, trendUp = true, icon: Icon, accent = "primary", sparkline }: KPICardProps) {
  const accentColors = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="p-6 rounded-xl border border-border bg-card/70 backdrop-blur-md"
    >
      <div className="flex justify-between items-start">
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
        <div className={`p-2 rounded-lg ${accentColors[accent]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-3xl font-bold tracking-tight tabular-nums">{value}</h3>
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? "text-success" : "text-destructive"}`}>
            {trendUp ? "+" : ""}{trend}
          </span>
        )}
      </div>
      {sparkline && (
        <div className="mt-3 flex items-end gap-0.5 h-8">
          {sparkline.map((v, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${accent === "destructive" ? "bg-destructive/30" : "bg-primary/20"}`}
              style={{ height: `${(v / Math.max(...sparkline)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
