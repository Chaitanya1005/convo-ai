"use client";
import Navbar from "@/components/Navbar";
import {
  ALL_PROCESSED_LEADS, TOTAL, HOT, WARM, COLD, CONVERSION_RATE,
  TOP_OBJECTIONS, TOP_INTENTS, TOP_CITIES, FUNNEL,
} from "@/lib/data";
import { getStatusColor } from "@/lib/utils";
import {
  Users, Flame, Thermometer, Wind, Target,
  AlertTriangle, ChevronRight, MapPin, Layers, TrendingUp,
} from "lucide-react";

// ── tiny reusable card ──────────────────────────────────────────────────────
function SummaryCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string | number; sub: string; accent: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border p-4 flex items-start gap-3 ${accent}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-slate-800 leading-none">{value}</div>
        <div className="text-xs font-semibold text-slate-700 mt-1">{label}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

// ── horizontal bar ──────────────────────────────────────────────────────────
function HBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-600 truncate max-w-[180px]" title={label}>{label}</span>
        <span className="text-xs font-bold font-mono text-slate-700 ml-2">{count}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── page ────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  // Engagement score: Hot=3, Warm=2, Cold=1 scaled to 100
  const engagementScore = Math.round(((HOT * 3 + WARM * 2 + COLD * 1) / (TOTAL * 3)) * 100);
  const avgResponseTime = "2.4s";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-xl font-bold text-slate-800">Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Insights from {TOTAL} processed leads · Convo-AI v2.1</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard icon={<Users size={18} className="text-brand-600" />}    label="Total Leads"      value={TOTAL}              sub="This batch"           accent="bg-brand-50 border-brand-100" />
          <SummaryCard icon={<Flame size={18} className="text-green-600" />}    label="Hot Leads"        value={HOT}                sub="Ready to onboard"     accent="bg-green-50 border-green-100" />
          <SummaryCard icon={<Target size={18} className="text-amber-600" />}   label="Conversion Rate"  value={`${CONVERSION_RATE}%`} sub="Hot lead %"        accent="bg-amber-50 border-amber-100" />
          <SummaryCard icon={<TrendingUp size={18} className="text-purple-600" />} label="Engagement Score" value={`${engagementScore}%`} sub="Weighted interest" accent="bg-purple-50 border-purple-100" />
        </div>

        {/* ROW 2: Funnel + Objections + Intents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* FUNNEL */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={15} className="text-slate-500" />
              <h2 className="text-sm font-bold text-slate-700">Conversion Funnel</h2>
            </div>
            <div className="space-y-2">
              {FUNNEL.map((stage, i) => {
                const colors = ["bg-brand-500", "bg-brand-400", "bg-amber-400", "bg-green-500"];
                const pct = TOTAL > 0 ? Math.round((stage.count / TOTAL) * 100) : 0;
                return (
                  <div key={stage.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600">{stage.label}</span>
                      <span className="text-xs font-bold font-mono text-slate-700">{stage.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden">
                      <div
                        className={`${colors[i]} h-6 rounded-full flex items-center justify-end pr-2`}
                        style={{ width: `${pct}%` }}
                      >
                        <span className="text-white text-[10px] font-semibold">{pct}%</span>
                      </div>
                    </div>
                    {i < FUNNEL.length - 1 && (
                      <div className="flex justify-center my-1">
                        <ChevronRight size={12} className="text-slate-300 rotate-90" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* TOP OBJECTIONS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={15} className="text-amber-500" />
              <h2 className="text-sm font-bold text-slate-700">Top Objections</h2>
            </div>
            <div className="space-y-3">
              {TOP_OBJECTIONS.map(([obj, count]) => (
                <HBar key={obj} label={obj} count={count} max={TOTAL} color="bg-amber-400" />
              ))}
            </div>
          </div>

          {/* LEAD INTENT BREAKDOWN */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target size={15} className="text-brand-500" />
              <h2 className="text-sm font-bold text-slate-700">Lead Intent Breakdown</h2>
            </div>
            <div className="space-y-3">
              {TOP_INTENTS.map(([intent, count]) => (
                <HBar key={intent} label={intent} count={count} max={TOTAL} color="bg-brand-400" />
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: Status distribution bar chart + City + Engagement insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* STATUS DISTRIBUTION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={15} className="text-slate-500" />
              <h2 className="text-sm font-bold text-slate-700">Status Distribution</h2>
            </div>
            <div className="flex items-end justify-around h-36 border-b border-slate-100 mb-3">
              {[
                { label: "Hot",  val: HOT,  hex: "#22c55e" },
                { label: "Warm", val: WARM, hex: "#fbbf24" },
                { label: "Cold", val: COLD, hex: "#d1d5db" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-xs font-bold text-slate-700">{b.val}</span>
                  <div
                    className="w-12 rounded-t-lg transition-all duration-700 flex-shrink-0"
                    style={{ height: `${TOTAL > 0 ? (b.val / TOTAL) * 120 : 0}px`, backgroundColor: b.hex }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-around">
              {[
                { label: "Hot",  dot: "bg-green-400" },
                { label: "Warm", dot: "bg-amber-400"  },
                { label: "Cold", dot: "bg-slate-300"  },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${l.dot}`} />
                  <span className="text-[10px] text-slate-500 font-medium">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOP CITIES */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={15} className="text-slate-500" />
              <h2 className="text-sm font-bold text-slate-700">Lead Geography</h2>
            </div>
            <div className="space-y-3">
              {TOP_CITIES.map(([city, count]) => (
                <HBar key={city} label={city} count={count} max={TOTAL} color="bg-purple-400" />
              ))}
            </div>
          </div>

          {/* ENGAGEMENT INSIGHTS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-slate-500" />
              <h2 className="text-sm font-bold text-slate-700">Engagement Insights</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Avg AI Response Time",    value: avgResponseTime,        sub: "Per lead"              },
                { label: "Objection Resolution Rate", value: `${Math.round(((HOT + WARM) / TOTAL) * 100)}%`, sub: "Hot + Warm converted"  },
                { label: "Immediate Drop-offs",      value: COLD,                  sub: "Cold leads"            },
                { label: "Avg Engagement Score",     value: `${engagementScore}%`, sub: "Weighted interest"    },
                { label: "Top Performing Segment",   value: "No objection",        sub: "100% conversion"       },
                { label: "Lowest Segment",           value: "Will think later",    sub: "Cold classification"   },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <div>
                    <div className="text-xs font-medium text-slate-700">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 ml-4 text-right flex-shrink-0">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LEAD STATUS MINI-TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-700">Lead Status Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["Lead ID", "Name", "City", "Intent", "Status", "Investment Range"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_PROCESSED_LEADS.map((lead, i) => {
                  const c = getStatusColor(lead.status);
                  return (
                    <tr key={lead.id} className={`border-b border-slate-100 ${i % 2 === 0 ? "" : "bg-slate-50/40"}`}>
                      <td className="px-4 py-2.5 text-xs font-mono text-slate-500">{lead.id}</td>
                      <td className="px-4 py-2.5 text-xs font-semibold text-slate-800">{lead.name}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">{lead.city}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">{lead.intent}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">{lead.investmentRange}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
