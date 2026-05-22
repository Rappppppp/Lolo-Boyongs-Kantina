"use client"
import { useEffect, useMemo, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Truck,
  CheckCircle,
  Loader2,
  LogOut,
  Clock,
  MapPin,
  Phone,
  Package,
  Navigation,
  DollarSign,
  RefreshCw,
} from "lucide-react"
import { useOrders } from "@/hooks/rider/useOrders"
import { useRiderStats, RiderStats } from "@/hooks/rider/useRiderStats"
import { Order } from "@/app/types/order"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import LogoutModal from "@/components/auth/logout-modal"
import { cn } from "@/lib/utils"

type FilterTab = "all" | "otw" | "delivered"

const STATUS_CFG: Record<string, { label: string; dot: string; badge: string }> = {
  otw:       { label: "On the Way", dot: "bg-primary",     badge: "bg-primary/10 text-primary border-primary/20" },
  delivered: { label: "Delivered",  dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "Completed",  dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled",  dot: "bg-rose-400",    badge: "bg-rose-50 text-rose-700 border-rose-200" },
  pending:   { label: "Pending",    dot: "bg-muted-foreground/40", badge: "bg-muted text-muted-foreground border-border" },
  confirmed: { label: "Confirmed",  dot: "bg-blue-400",    badge: "bg-blue-50 text-blue-700 border-blue-200" },
  ready:     { label: "Ready",      dot: "bg-violet-400",  badge: "bg-violet-50 text-violet-700 border-violet-200" },
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}
function formatTime(d: Date) {
  return d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", hour12: true })
}
function formatDate(d: Date) {
  return d.toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" })
}
function formatCurrency(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  )
}

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border", cfg.badge)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot, status === "otw" && "animate-pulse")} />
      {cfg.label}
    </span>
  )
}

function MiniBar({ trend }: { trend: { label: string; value: number }[] }) {
  const max = Math.max(...trend.map((t) => t.value), 1)
  return (
    <div className="flex items-end gap-0.5 h-6">
      {trend.map((t, i) => (
        <div key={i} className="flex-1">
          <div
            className="w-full rounded-sm bg-primary/50 transition-all"
            style={{ height: `${Math.max((t.value / max) * 22, t.value > 0 ? 3 : 1)}px` }}
          />
        </div>
      ))}
    </div>
  )
}

function KpiCell({
  label,
  value,
  icon,
  accent = "bg-primary/10 text-primary",
  live,
  trend,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  accent?: string
  live?: boolean
  trend?: { label: string; value: number }[]
}) {
  return (
    <div className="bg-background px-5 py-5 flex flex-col justify-between min-h-[110px]">
      <div className="flex items-center justify-between">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", accent)}>{icon}</div>
        {live && <LiveDot />}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-foreground leading-none tabular-nums">{value}</p>
      </div>
      {trend && <MiniBar trend={trend} />}
    </div>
  )
}

function OrderRow({ order, onConfirm }: { order: Order; onConfirm: (o: Order) => void }) {
  const isActive = order.status === "otw"
  return (
    <div
      className={cn(
        "group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4",
        "px-5 py-4 hover:bg-muted/25 transition-colors",
        isActive && "border-l-2 border-l-primary bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="flex flex-col items-center self-stretch pt-1.5 shrink-0">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              STATUS_CFG[order.status]?.dot ?? "bg-muted-foreground/30",
              isActive && "animate-pulse"
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-foreground">#{order.order_id}</span>
            <StatusPill status={order.status} />
          </div>
          <p className="text-sm font-medium text-foreground/80 mt-0.5 truncate">{order.receipient_name ?? "—"}</p>
          {order.address && (
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{order.address}</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 pl-5 sm:pl-0 shrink-0 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Package className="w-3 h-3" />
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
        </span>
        {order.phone_number && (
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {order.phone_number}
          </span>
        )}
      </div>
      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 pl-5 sm:pl-0 shrink-0">
        <span className="text-sm font-bold text-foreground tabular-nums">{formatCurrency(order.items_total)}</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {order.created_at_human}
        </span>
      </div>
      <div className="pl-5 sm:pl-0 shrink-0">
        {isActive ? (
          <Button
            size="sm"
            onClick={() => onConfirm(order)}
            className="h-8 px-3 text-xs bg-linear-to-br from-primary to-orange-400 hover:opacity-90 text-white gap-1.5 rounded-lg font-medium"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Confirm Delivery
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}
      </div>
    </div>
  )
}

export default function RiderPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<RiderStats | null>(null)
  const [filter, setFilter] = useState<FilterTab>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [now, setNow] = useState(new Date())

  const { fetchOrders, updateOrderStatus, loading } = useOrders()
  const { fetchStats, loading: statsLoading } = useRiderStats()

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const loadAll = useCallback(() => {
    fetchOrders().then(setOrders).catch(() => {})
    fetchStats().then(setStats).catch(() => {})
  }, [fetchOrders, fetchStats])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const orderCounts = useMemo(
    () => ({
      all: orders.length,
      otw: orders.filter((o) => o.status === "otw").length,
      delivered: orders.filter((o) => o.status === "delivered" || o.status === "completed").length,
    }),
    [orders]
  )

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders
    if (filter === "delivered") return orders.filter((o) => o.status === "delivered" || o.status === "completed")
    return orders.filter((o) => o.status === filter)
  }, [orders, filter])

  const completionRate = useMemo(() => {
    const total = orderCounts.all
    return total > 0 ? Math.round((orderCounts.delivered / total) * 100) : 0
  }, [orderCounts])

  const handleConfirmDelivery = useCallback(() => {
    if (!selectedOrder) return
    setOrders((prev) =>
      prev.map((o) => (o.order_id === selectedOrder.order_id ? { ...o, status: "delivered" } : o))
    )
    setIsConfirmModalOpen(false)
    updateOrderStatus({ order_id: selectedOrder.order_id, status: "delivered" })
    setSelectedOrder(null)
  }, [selectedOrder, updateOrderStatus])

  const FILTERS: { key: FilterTab; label: string; count: number }[] = [
    { key: "all",       label: "All",       count: orderCounts.all },
    { key: "otw",       label: "Active",    count: orderCounts.otw },
    { key: "delivered", label: "Completed", count: orderCounts.delivered },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-linear-to-br from-primary to-orange-400 text-white sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-white" />
              <span className="text-sm font-bold">Rider Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOnline((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                  isOnline
                    ? "bg-white/20 border-white/30 text-white"
                    : "bg-white/10 border-white/20 text-white/60"
                )}
              >
                {isOnline ? (
                  <>
                    <LiveDot />
                    <span className="ml-0.5">Online</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white/40 inline-block shrink-0" />
                    <span>Offline</span>
                  </>
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-lg hover:bg-orange-700 text-white"
                onClick={loadAll}
                disabled={loading || statsLoading}
              >
                <RefreshCw className={cn("w-3.5 h-3.5", (loading || statsLoading) && "animate-spin")} />
              </Button>
              <LogoutModal>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-orange-700 text-white">
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </LogoutModal>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Page heading + completion ring */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.14em] mb-1">
              {formatDate(now)} · {formatTime(now)}
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              {getGreeting()}, Rider
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {orderCounts.otw > 0
                ? `${orderCounts.otw} active deliver${orderCounts.otw === 1 ? "y" : "ies"} in progress`
                : "No active deliveries. Ready to roll?"}
            </p>
          </div>
          <div className="flex items-center gap-3 bg-background rounded-2xl px-5 py-4 border border-border/50 self-start sm:self-auto shrink-0">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeDasharray={`${(completionRate / 100) * 87.96} 87.96`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">
                {completionRate}%
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{completionRate}% done</p>
              <p className="text-xs text-muted-foreground">
                {orderCounts.delivered} / {orderCounts.all} orders
              </p>
            </div>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border/50 bg-border/20">
          <KpiCell
            label="Active Deliveries"
            value={stats?.active_deliveries ?? orderCounts.otw}
            icon={<Navigation className="w-3.5 h-3.5" />}
            accent="bg-primary/10 text-primary"
            live={orderCounts.otw > 0}
          />
          <KpiCell
            label="Completed Today"
            value={stats?.completed_today ?? orderCounts.delivered}
            icon={<CheckCircle className="w-3.5 h-3.5" />}
            accent="bg-emerald-500/10 text-emerald-600"
            trend={stats?.trend}
          />
          <KpiCell
            label="Earnings Today"
            value={stats ? formatCurrency(stats.earnings_today) : "—"}
            icon={<DollarSign className="w-3.5 h-3.5" />}
            accent="bg-sky-500/10 text-sky-600"
          />
          <KpiCell
            label="Pending Pickups"
            value={stats?.pending_pickups ?? 0}
            icon={<Package className="w-3.5 h-3.5" />}
            accent="bg-orange-500/10 text-orange-600"
          />
        </div>

        {/* Orders list */}
        <div>
          <div className="flex items-center mb-4">
            <div className="flex items-center bg-white border border-border/50 rounded-xl p-1 gap-1">
              {FILTERS.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all",
                    filter === key
                      ? "bg-linear-to-br from-primary to-orange-400 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full font-medium tabular-nums min-w-5 text-center",
                      filter === key ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
            {loading ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading orders…</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <Truck className="w-8 h-8 text-muted-foreground/20" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">No orders here</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {filter === "otw" ? "No active deliveries right now." : "Nothing to show for this filter."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order.order_id}
                    order={order}
                    onConfirm={(o) => {
                      setSelectedOrder(o)
                      setIsConfirmModalOpen(true)
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm delivery dialog */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Confirm Delivery</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Mark this order as delivered and complete the trip.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="mt-1 bg-muted/40 rounded-xl p-4 space-y-2.5">
              {[
                { label: "Order",     value: `#${selectedOrder.order_id}`, mono: true },
                { label: "Recipient", value: selectedOrder.receipient_name ?? "—" },
                ...(selectedOrder.address      ? [{ label: "Address", value: selectedOrder.address }] : []),
                ...(selectedOrder.phone_number ? [{ label: "Phone",   value: selectedOrder.phone_number }] : []),
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs text-muted-foreground shrink-0">{label}</span>
                  <span className={cn("text-sm text-right text-foreground", mono && "font-mono")}>{value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {formatCurrency(selectedOrder.items_total)}
                </span>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2 mt-2">
            <Button
              variant="outline"
              className="flex-1 h-9 text-sm rounded-xl"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelivery}
              className="flex-1 h-9 text-sm bg-linear-to-br from-primary to-orange-400 hover:opacity-90 text-white rounded-xl gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Mark Delivered
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}