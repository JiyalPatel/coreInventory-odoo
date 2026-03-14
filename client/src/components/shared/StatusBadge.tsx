const statusStyles: Record<string, string> = {
  "in stock": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "low stock": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  "out of stock": "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  draft: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  waiting: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  ready: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  done: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  canceled: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  receipt: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  delivery: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  transfer: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  adjustment: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const style = statusStyles[key] || "bg-muted text-muted-foreground border-border";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {status}
    </span>
  );
}
