import { motion } from "framer-motion";
import { Package, AlertTriangle, ArrowDownToLine, Truck, ArrowLeftRight, Plus, FileText, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { KPICard } from "@/components/shared/KPICard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";

const inventoryData = [
  { month: "Jan", inbound: 420, outbound: 380 },
  { month: "Feb", inbound: 380, outbound: 410 },
  { month: "Mar", inbound: 510, outbound: 390 },
  { month: "Apr", inbound: 470, outbound: 520 },
  { month: "May", inbound: 540, outbound: 480 },
  { month: "Jun", inbound: 620, outbound: 510 },
  { month: "Jul", inbound: 580, outbound: 560 },
];

const warehouseData = [
  { name: "Main", stock: 2450 },
  { name: "East", stock: 1820 },
  { name: "West", stock: 1340 },
  { name: "South", stock: 890 },
];

const recentActivity = [
  { id: 1, action: "Receipt validated", ref: "WH/IN/00042", user: "Sarah K.", time: "5 min ago", type: "receipt" },
  { id: 2, action: "Delivery shipped", ref: "WH/OUT/00108", user: "Mike R.", time: "12 min ago", type: "delivery" },
  { id: 3, action: "Stock adjusted", ref: "ADJ/00015", user: "Jane D.", time: "25 min ago", type: "adjustment" },
  { id: 4, action: "Transfer completed", ref: "WH/INT/00033", user: "Tom L.", time: "1 hr ago", type: "transfer" },
  { id: 5, action: "New product added", ref: "SKU-7829", user: "Sarah K.", time: "2 hrs ago", type: "receipt" },
];

const lowStockItems = [
  { product: "Widget Pro X", sku: "WPX-001", warehouse: "Main", stock: 5, min: 50 },
  { product: "Sensor Module A", sku: "SMA-042", warehouse: "East", stock: 8, min: 30 },
  { product: "Cable Assembly B", sku: "CAB-019", warehouse: "Main", stock: 12, min: 40 },
  { product: "PCB Board Rev3", sku: "PCB-003", warehouse: "West", stock: 3, min: 25 },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your inventory command center"
        actions={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-accent transition-colors">
              <FileText size={16} /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus size={16} /> Quick Action
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Products" value="2,847" trend="12%" icon={Package} accent="primary" />
        <KPICard label="Low / Out of Stock" value="23" trend="-5%" trendUp={false} icon={AlertTriangle} accent="destructive" sparkline={[45, 38, 32, 28, 25, 23, 23]} />
        <KPICard label="Pending Receipts" value="18" trend="8%" icon={ArrowDownToLine} accent="warning" />
        <KPICard label="Pending Deliveries" value="34" trend="15%" icon={Truck} accent="success" />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card/70 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Inventory Velocity</h3>
              <p className="text-sm text-muted-foreground">Inbound vs Outbound trends</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Inbound</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success" /> Outbound</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={inventoryData}>
              <defs>
                <linearGradient id="inbound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(239 84% 67%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outbound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(215 16% 47%)' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(215 16% 47%)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="inbound" stroke="hsl(239 84% 67%)" fill="url(#inbound)" strokeWidth={2} />
              <Area type="monotone" dataKey="outbound" stroke="hsl(142 71% 45%)" fill="url(#outbound)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card/70 backdrop-blur-md">
          <h3 className="font-semibold mb-1">Warehouse Distribution</h3>
          <p className="text-sm text-muted-foreground mb-6">Stock by location</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={warehouseData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'hsl(215 16% 47%)', fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(215 16% 47%)', fontSize: 12 }} width={50} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem', fontSize: '12px' }} />
              <Bar dataKey="stock" fill="hsl(239 84% 67%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="p-6 rounded-xl border border-border bg-card/70 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle size={16} className="text-warning" /> Low Stock Alerts
            </h3>
            <span className="text-xs text-muted-foreground">{lowStockItems.length} items</span>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.sku} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{item.product}</p>
                  <p className="text-xs text-muted-foreground">{item.sku} · {item.warehouse}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-destructive">{item.stock}</p>
                  <p className="text-xs text-muted-foreground">min: {item.min}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-xl border border-border bg-card/70 backdrop-blur-md">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="relative space-y-4">
            <div className="absolute left-[7px] top-2 bottom-2 w-px border-l border-dashed border-border" />
            {recentActivity.map((a) => (
              <div key={a.id} className="flex gap-4 relative">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-primary bg-background mt-1 relative z-10 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground font-mono">{a.ref}</span>
                    <StatusBadge status={a.type} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.user} · {a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
