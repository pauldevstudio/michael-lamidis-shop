"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshCw, CheckCircle, AlertCircle, Package, ShoppingBag, TrendingUp,
  Clock, Truck, Check, X, Trash2, Mail, Phone, MapPin, CreditCard, Banknote, Store,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "cancelled";
type Payment = "bank_transfer" | "cash_on_delivery" | "showroom_pickup";

interface Order {
  id: string;
  customer: {
    fullName: string; email: string; phone: string;
    address?: string; city?: string; postalCode?: string; notes?: string;
  };
  items: Array<{ productId: string; brand: string; model: string; salePrice: number; quantity: number }>;
  totalPrice: number;
  payment: Payment;
  status: OrderStatus;
  createdAt: string;
}

type Toast = { type: "success" | "error"; msg: string } | null;

const STATUSES: { id: OrderStatus | "all"; label: string; color: string; bg: string }[] = [
  { id: "all",       label: "All",        color: "#475569", bg: "#F1F5F9" },
  { id: "new",       label: "New",        color: "#2563EB", bg: "#DBEAFE" },
  { id: "confirmed", label: "Confirmed",  color: "#7C3AED", bg: "#EDE9FE" },
  { id: "shipped",   label: "Shipped",    color: "#D97706", bg: "#FEF3C7" },
  { id: "delivered", label: "Delivered",  color: "#059669", bg: "#D1FAE5" },
  { id: "cancelled", label: "Cancelled",  color: "#DC2626", bg: "#FEE2E2" },
];

const PAYMENT_META: Record<Payment, { label: string; icon: typeof CreditCard }> = {
  bank_transfer:    { label: "Bank Transfer",    icon: CreditCard },
  cash_on_delivery: { label: "Cash on Delivery", icon: Banknote },
  showroom_pickup:  { label: "Showroom Pickup",  icon: Store },
};

function fmtPrice(n: number) {
  return `€${n.toLocaleString("el-GR")}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function statusMeta(s: OrderStatus) {
  return STATUSES.find((x) => x.id === s) ?? STATUSES[1];
}

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = (await res.json()) as { orders: Order[] };
        setOrders(data.orders ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    // Optimistic
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast("success", "Status updated");
      } else {
        showToast("error", "Failed to update status");
        await fetchOrders();
      }
    } catch {
      showToast("error", "Network error");
      await fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        showToast("success", "Order deleted");
      } else {
        showToast("error", "Failed to delete");
      }
    } catch {
      showToast("error", "Network error");
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  const stats = useMemo(() => {
    const total = orders.length;
    const newCount = orders.filter((o) => o.status === "new").length;
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.totalPrice, 0);
    const today = orders.filter((o) => {
      const d = new Date(o.createdAt);
      const now = new Date();
      return d.getFullYear() === now.getFullYear()
        && d.getMonth() === now.getMonth()
        && d.getDate() === now.getDate();
    }).length;
    return { total, newCount, revenue, today };
  }, [orders]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length };
    for (const s of STATUSES) {
      if (s.id === "all") continue;
      map[s.id] = orders.filter((o) => o.status === s.id).length;
    }
    return map;
  }, [orders]);

  return (
    <>
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium border"
          style={{
            background: toast.type === "success" ? "#F0FDF4" : "#FEF2F2",
            borderColor: toast.type === "success" ? "#BBF7D0" : "#FECACA",
            color: toast.type === "success" ? "#166534" : "#991B1B",
          }}
        >
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
          {toast.msg}
        </div>
      )}

      <AdminHeader
        title="Orders"
        subtitle={`${stats.total} order${stats.total === 1 ? "" : "s"} · ${stats.newCount} awaiting action`}
        actions={
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 transition disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        }
      />

      <main className="flex-1 overflow-auto p-6 bg-slate-800">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Orders" value={stats.total.toString()} icon={ShoppingBag} color="#3A5F8A" />
          <StatCard label="New" value={stats.newCount.toString()} icon={Clock} color="#2563EB" />
          <StatCard label="Today" value={stats.today.toString()} icon={TrendingUp} color="#059669" />
          <StatCard label="Revenue" value={fmtPrice(stats.revenue)} icon={Package} color="#D97706" />
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUSES.map((s) => {
            const active = filter === s.id;
            const count = counts[s.id] ?? 0;
            return (
              <button
                key={s.id}
                onClick={() => setFilter(s.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                  active
                    ? "text-white shadow-md"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-700 border border-slate-700"
                }`}
                style={active ? { background: s.color } : {}}
              >
                {s.label}
                <span
                  className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center ${
                    active ? "bg-white/25 text-white" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-5 h-5 animate-spin text-slate-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No orders {filter !== "all" ? `with status "${filter}"` : "yet"}</p>
            <p className="text-xs text-slate-500 mt-1">
              When a customer places an order it&apos;ll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => {
              const meta = statusMeta(o.status);
              const Pay = PAYMENT_META[o.payment].icon;
              const isOpen = expanded === o.id;
              return (
                <div
                  key={o.id}
                  className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden"
                >
                  {/* Row */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-800/60 transition"
                    onClick={() => setExpanded(isOpen ? null : o.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="text-slate-100 font-semibold text-sm">{o.customer.fullName}</p>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: meta.color, background: meta.bg }}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs mt-1">
                        {o.items.length} item{o.items.length === 1 ? "" : "s"} · {fmtDate(o.createdAt)}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-slate-300 text-xs font-medium">
                      <Pay className="w-3.5 h-3.5" />
                      {PAYMENT_META[o.payment].label}
                    </div>

                    <p className="text-slate-100 font-black text-base whitespace-nowrap">
                      {fmtPrice(o.totalPrice)}
                    </p>
                  </div>

                  {/* Expanded panel */}
                  {isOpen && (
                    <div className="border-t border-slate-700 p-4 space-y-4 bg-slate-800/40">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Customer */}
                        <div>
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Customer</p>
                          <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-2 text-slate-200">
                              <Mail className="w-3.5 h-3.5 text-slate-500" />
                              <a href={`mailto:${o.customer.email}`} className="hover:text-gold-400 truncate">
                                {o.customer.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-slate-200">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <a href={`tel:${o.customer.phone.replace(/\s+/g, "")}`} className="hover:text-gold-400">
                                {o.customer.phone}
                              </a>
                            </div>
                            {o.customer.address && (
                              <div className="flex items-start gap-2 text-slate-200">
                                <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5" />
                                <span>
                                  {o.customer.address}, {o.customer.city}
                                  {o.customer.postalCode ? `, ${o.customer.postalCode}` : ""}
                                </span>
                              </div>
                            )}
                            {o.customer.notes && (
                              <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-300 mt-2">
                                {o.customer.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Items */}
                        <div>
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Items</p>
                          <ul className="space-y-2">
                            {o.items.map((it, i) => (
                              <li key={i} className="flex justify-between gap-2 text-sm">
                                <span className="text-slate-200">
                                  <span className="text-slate-500 mr-2">×{it.quantity}</span>
                                  {it.brand} {it.model}
                                </span>
                                <span className="text-slate-300 font-semibold whitespace-nowrap">
                                  {fmtPrice(it.salePrice * it.quantity)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-700">
                        <div className="flex items-center gap-2">
                          <label className="text-slate-400 text-xs font-medium">Status:</label>
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                            disabled={updatingId === o.id}
                            className="border border-slate-700 bg-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/30 disabled:opacity-60"
                          >
                            {STATUSES.filter((s) => s.id !== "all").map((s) => (
                              <option key={s.id} value={s.id}>{s.label}</option>
                            ))}
                          </select>
                          {updatingId === o.id && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />}
                        </div>
                        <button
                          onClick={() => setDeleteId(o.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs font-medium hover:text-red-400 hover:border-red-400/50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Delete confirm */}
        {deleteId && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-700">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-slate-100 font-bold text-lg text-center mb-1">Delete order?</h3>
              <p className="text-slate-400 text-sm text-center mb-6">This permanently removes it. The customer is not notified.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800">Cancel</button>
                <button onClick={() => deleteOrder(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600">Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function StatCard({
  label, value, icon: Icon, color,
}: {
  label: string; value: string; icon: typeof Package; color: string;
}) {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: color + "20" }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-slate-100 font-display font-black text-xl">{value}</p>
      <p className="text-slate-400 text-[11px] font-medium mt-0.5">{label}</p>
    </div>
  );
}
