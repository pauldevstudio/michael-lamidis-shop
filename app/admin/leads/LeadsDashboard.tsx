"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Phone,
  MessageSquare,
  Trash2,
  ChevronRight,
  X,
  Bot,
} from "lucide-react";
import type { Lead } from "@/lib/leads";

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700 shadow-sm flex items-start gap-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-100 leading-tight">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeadsDashboard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const totalMessages = leads.reduce((sum, l) => sum + l.chatLog.length, 0);
  const avgMessages = leads.length > 0 ? Math.round(totalMessages / leads.length) : 0;
  const withPhone = leads.filter((l) => l.phone && l.phone !== "Unknown").length;

  const handleDelete = async (lead: Lead) => {
    if (!confirm(`Delete lead for ${lead.name}?`)) return;
    setDeleting(lead.id);
    try {
      await fetch(`/api/leads?id=${lead.id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      if (selected?.id === lead.id) setSelected(null);
    } catch {
      alert("Failed to delete lead. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
              style={{ background: "linear-gradient(135deg, #1A3C5E, #2563EB)" }}
            >
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">AI Chat Leads</h1>
              <p className="text-slate-500 text-sm">Leads captured by the AI assistant</p>
            </div>
          </div>
          <span className="text-sm text-gray-400 bg-slate-800 px-3 py-1.5 rounded-full font-medium">
            {leads.length} total
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Users} value={leads.length} label="Total Leads" color="#2563EB" />
          <StatCard icon={Phone} value={withPhone} label="With Phone Number" color="#16A34A" />
          <StatCard
            icon={MessageSquare}
            value={avgMessages}
            label="Avg. Messages per Lead"
            color="#9333EA"
          />
        </div>

        {/* Empty state */}
        {leads.length === 0 && (
          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-12 text-center shadow-sm">
            <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-1">No leads yet</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Leads will appear here when visitors chat with the AI assistant and share their contact
              info.
            </p>
          </div>
        )}

        {/* Two-column layout */}
        {leads.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Lead list */}
            <div className="lg:col-span-2 space-y-2">
              {leads.map((lead) => {
                const active = selected?.id === lead.id;
                return (
                  <motion.div
                    key={lead.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`group bg-slate-900 rounded-xl border transition-all cursor-pointer shadow-sm ${
                      active
                        ? "border-blue-400 ring-2 ring-blue-100"
                        : "border-slate-700 hover:border-blue-200"
                    }`}
                    onClick={() => setSelected(active ? null : lead)}
                  >
                    <div className="flex items-center gap-3 p-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #1A3C5E, #2563EB)" }}
                      >
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-100 truncate">{lead.name}</p>
                        <p className="text-sm text-blue-600 truncate">{lead.phone}</p>
                      </div>
                      <div className="text-right flex-shrink-0 mr-1">
                        <p className="text-xs text-gray-400">{formatDate(lead.timestamp)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{lead.chatLog.length} msgs</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(lead);
                          }}
                          disabled={deleting === lead.id}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight
                          className={`w-4 h-4 transition-colors ${
                            active ? "text-blue-500" : "text-gray-300"
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Chat log panel */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    className="bg-slate-900 rounded-2xl border border-slate-700 shadow-sm overflow-hidden"
                  >
                    {/* Panel header */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-slate-800">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #1A3C5E, #2563EB)" }}
                      >
                        {selected.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-100">{selected.name}</p>
                        <p className="text-xs text-slate-500">
                          {selected.phone} · {formatDate(selected.timestamp)} at{" "}
                          {formatTime(selected.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelected(null)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-slate-400 hover:bg-slate-800 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="p-4 space-y-3 max-h-[480px] overflow-y-auto">
                      {selected.chatLog.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm py-8">
                          No chat log saved for this lead.
                        </p>
                      ) : (
                        selected.chatLog.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex gap-2 ${
                              msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            {msg.role === "assistant" && (
                              <div
                                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold mt-0.5"
                                style={{ background: "linear-gradient(135deg, #1A3C5E, #2563EB)" }}
                              >
                                ML
                              </div>
                            )}
                            <div
                              className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                                msg.role === "user"
                                  ? "text-white rounded-br-sm"
                                  : "bg-slate-800 text-gray-800 rounded-bl-sm"
                              }`}
                              style={
                                msg.role === "user"
                                  ? {
                                      background:
                                        "linear-gradient(135deg, #2563EB 0%, #1A3C5E 100%)",
                                    }
                                  : undefined
                              }
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-slate-900 rounded-2xl border border-dashed border-slate-700 p-12 flex flex-col items-center justify-center text-center shadow-sm"
                    style={{ minHeight: "300px" }}
                  >
                    <MessageSquare className="w-10 h-10 text-gray-200 mb-3" />
                    <p className="text-gray-400 text-sm">Select a lead to view their chat log</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
