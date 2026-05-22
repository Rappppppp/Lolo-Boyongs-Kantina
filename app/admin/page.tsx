"use client"

import { useEffect } from "react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Bike,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  PackageCheck,
  ArrowUpRight,
  CircleDot,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useDashboard, type DashboardData } from "@/hooks/admin/useDashboard"
import AdminSkeleton from "@/components/admin-skeleton"

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  pending:   { label: "Pending",    dot: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmed",  dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700 border-blue-200" },
  ready:     { label: "Ready",      dot: "bg-violet-400",  badge: "bg-violet-50 text-violet-700 border-violet-200" },
  otw:       { label: "On the Way", dot: "bg-indigo-400",  badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  delivered: { label: "Delivered",  dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled",  dot: "bg-rose-400",    badge: "bg-rose-50 text-rose-700 border-rose-200" },
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label, prefix = "" }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-background/95 backdrop-blur border border-border/60 rounded-xl shadow-xl px-4 py-2.5 text-sm min-w-[100px]">
      <p className="text-[11px] font-medium text-muted-foreground mb-1 uppercase tracking-wider">{label}</p>
      <p className="text-base font-bold text-foreground">
        {prefix}
        {typeof payload[0].value === "number" ? payload[0].value.toLocaleString() : payload[0].value}
      </p>
    </div>
  )
}

// ─── Order pipeline bar ───────────────────────────────────────────────────────
function PipelineBar({ dashboard }: { dashboard: DashboardData }) {
  const stages = [
    { key: "pending",   label: "Pending",    count: dashboard.pending_orders,   color: "bg-amber-400",   textColor: "text-amber-600",   iconBg: "bg-amber-50",   icon: Clock },
    { key: "confirmed", label: "Confirmed",  count: dashboard.confirmed_orders, color: "bg-blue-400",    textColor: "text-blue-600",    iconBg: "bg-blue-50",    icon: PackageCheck },
    { key: "otw",       label: "On the Way", count: dashboard.otw_orders,       color: "bg-indigo-400",  textColor: "text-indigo-600",  iconBg: "bg-indigo-50",  icon: Truck },
    { key: "delivered", label: "Delivered",  count: dashboard.delivered_orders, color: "bg-emerald-400", textColor: "text-emerald-600", iconBg: "bg-emerald-50", icon: CheckCircle2 },
    { key: "cancelled", label: "Cancelled",  count: dashboard.cancelled_orders, color: "bg-rose-400",    textColor: "text-rose-600",    iconBg: "bg-rose-50",    icon: XCircle },
  ]
  const total = stages.reduce((s, x) => s + x.count, 0) || 1

  return (
    <div className="space-y-4">
      <div className="flex h-2 rounded-full overflow-hidden gap-px bg-muted">
        {stages.map(({ key, color, count }) => (
          <div
            key={key}
            className={`${color} transition-all`}
            style={{ width: `${(count / total) * 100}%`, minWidth: count > 0 ? "3px" : "0" }}
          />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {stages.map(({ key, label, count, textColor, iconBg, icon: Icon }) => (
          <div key={key} className="flex flex-col items-center gap-1.5 text-center">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
              <Icon className={`w-3.5 h-3.5 ${textColor}`} />
            </div>
            <span className="text-2xl font-extrabold text-foreground leading-none">{count}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { fetchDashboard, dashboard, loading } = useDashboard()

  useEffect(() => {
    fetchDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const now = new Date()
  const dateLabel = now.toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-8 pb-10">
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.14em] mb-1">
            {dateLabel}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live overview of Lolo Boyong&apos;s Kantina operations.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CircleDot className="w-3 h-3 text-emerald-500" />
          <span className="text-xs font-semibold text-emerald-600">Live</span>
        </div>
      </div>

      {loading || !dashboard ? (
        <AdminSkeleton />
      ) : (
        <>
          {/* ── KPI Strip ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-px rounded-2xl overflow-hidden border border-border/50 bg-border/20">
            {/* Hero: Revenue */}
            <div className="lg:col-span-2 bg-background px-8 py-7 flex flex-col justify-between gap-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600 mb-2">
                    Total Revenue
                  </p>
                  <p className="text-5xl font-black tracking-tight text-foreground leading-none">
                    ₱{dashboard.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Avg order ·{" "}
                    <span className="font-semibold text-foreground">
                      ₱{dashboard.average_order_value.toFixed(2)}
                    </span>
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              {dashboard.revenue_trend?.length > 0 && (
                <ResponsiveContainer width="100%" height={44}>
                  <AreaChart data={dashboard.revenue_trend} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1.5} fill="url(#heroGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Secondary KPIs */}
            {[
              { label: "Total Orders", value: dashboard.total_orders.toLocaleString(), icon: ShoppingCart, accent: "text-primary",     iconBg: "bg-primary/10",        iconColor: "text-primary" },
              { label: "Customers",    value: dashboard.customers.toLocaleString(),     icon: Users,        accent: "text-sky-600",     iconBg: "bg-sky-500/10",        iconColor: "text-sky-600" },
              { label: "Active Riders",value: String(dashboard.riders_count),           icon: Bike,         accent: "text-orange-600",  iconBg: "bg-orange-500/10",     iconColor: "text-orange-600" },
              { label: "Delivered",    value: dashboard.delivered_orders.toLocaleString(), icon: CheckCircle2, accent: "text-emerald-600", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600" },
            ].map(({ label, value, icon: Icon, accent, iconBg, iconColor }) => (
              <div key={label} className="bg-background px-6 py-7 flex flex-col justify-between min-h-[130px]">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5 ${accent}`}>{label}</p>
                  <p className="text-3xl font-extrabold text-foreground leading-none">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order Pipeline ───────────────────────────────────── */}
          <div className="rounded-2xl border border-border/50 bg-background px-8 py-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground">Order Pipeline</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Live status distribution across all orders</p>
              </div>
              <span className="text-xs text-muted-foreground font-medium tabular-nums">
                {(
                  dashboard.pending_orders +
                  dashboard.confirmed_orders +
                  dashboard.otw_orders +
                  dashboard.delivered_orders +
                  dashboard.cancelled_orders
                ).toLocaleString()}{" "}
                total
              </span>
            </div>
            <PipelineBar dashboard={dashboard} />
          </div>

          {/* ── Charts ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border/50 bg-background px-6 pt-6 pb-3">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Orders This Week</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Mon – Sun</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                  7d
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dashboard.orders_this_week} barSize={26} margin={{ top: 0, right: 0, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 6 }} />
                  <Bar dataKey="value" radius={[5, 5, 2, 2]}>
                    {dashboard.orders_this_week.map((_, i, arr) => (
                      <Cell key={i} fill={i === arr.length - 1 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.3)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-border/50 bg-background px-6 pt-6 pb-3">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Revenue Trend</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Last 7 days</p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                  7d
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={dashboard.revenue_trend} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip prefix="₱" />} />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Activity feed + Top Items ────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Recent Orders – activity feed */}
            <div className="lg:col-span-3 rounded-2xl border border-border/50 bg-background overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
                <div>
                  <h2 className="text-sm font-bold text-foreground">Recent Orders</h2>
                  <p className="text-xs text-muted-foreground">Latest activity</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                {dashboard.recent_orders.map((order, i) => {
                  const s = STATUS_CONFIG[order.status] ?? {
                    label: order.status,
                    dot: "bg-gray-400",
                    badge: "bg-gray-50 text-gray-700 border-gray-200",
                  }
                  return (
                    <div
                      key={order.order_id}
                      className="group flex items-start gap-4 px-6 py-4 hover:bg-muted/25 transition-colors"
                    >
                      {/* timeline */}
                      <div className="flex flex-col items-center self-stretch pt-1.5">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                        {i < dashboard.recent_orders.length - 1 && (
                          <div className="w-px flex-1 bg-border/50 mt-1.5" />
                        )}
                      </div>
                      {/* content */}
                      <div className="flex-1 flex items-center justify-between gap-3 min-w-0 pb-1">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground leading-tight">
                            {order.receipient_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            #{order.order_id} · {order.created_at_human}
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-sm font-bold text-foreground tabular-nums">
                            ₱{order.items_total.toLocaleString()}
                          </span>
                          <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 ${s.badge}`}>
                            {s.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Top Items */}
            <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-background overflow-hidden">
              <div className="px-6 py-5 border-b border-border/50">
                <h2 className="text-sm font-bold text-foreground">Top Items</h2>
                <p className="text-xs text-muted-foreground">Last 30 days · by quantity</p>
              </div>
              <div className="px-6 py-5 space-y-5">
                {dashboard.top_items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No data yet</p>
                ) : (
                  dashboard.top_items.map((item, idx) => {
                    const maxQty = dashboard.top_items[0].total_qty
                    const pct = Math.round((item.total_qty / maxQty) * 100)
                    const rankStyle = [
                      "text-amber-600 bg-amber-50 border-amber-200",
                      "text-slate-500 bg-slate-50 border-slate-200",
                      "text-orange-500 bg-orange-50 border-orange-200",
                    ][idx] ?? "text-muted-foreground bg-muted border-border"
                    const barColor = idx === 0 ? "bg-primary" : idx === 1 ? "bg-primary/60" : "bg-primary/40"

                    return (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`text-[10px] font-extrabold w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${rankStyle}`}>
                              {idx + 1}
                            </span>
                            <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="text-sm font-bold text-foreground tabular-nums">{item.total_qty}</span>
                            <span className="text-[10px] text-muted-foreground ml-1">sold</span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground tabular-nums">
                          ₱{item.total_revenue.toLocaleString()} revenue
                        </p>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
