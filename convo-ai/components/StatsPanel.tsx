"use client";
import { Flame, Thermometer, Wind, TrendingUp, AlertTriangle } from "lucide-react";
import { Stats } from "@/app/workspace/page";

interface Props {
  stats: Stats;
  total: number;
}

export default function StatsPanel({ stats, total }: Props) {
  const conversionRate = stats.processed > 0 ? Math.round((stats.hot / stats.processed) * 100) : 0;

  return (
    <div className="p-4 space-y-6">
      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Live Stats</div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Leads Processed</span>
            <span className="text-xs font-bold text-slate-800 font-mono">{stats.processed}/{total}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${total > 0 ? (stats.processed / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <StatRow icon={<Flame size={14} className="text-green-600" />} label="Hot Leads" value={stats.hot} color="text-green-600" bg="bg-green-50" border="border-green-100" />
          <StatRow icon={<Thermometer size={14} className="text-amber-500" />} label="Warm Leads" value={stats.warm} color="text-amber-600" bg="bg-amber-50" border="border-amber-100" />
          <StatRow icon={<Wind size={14} className="text-slate-400" />} label="Cold Leads" value={stats.cold} color="text-slate-500" bg="bg-slate-50" border="border-slate-200" />
        </div>
      </div>

      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Conversion Rate</div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={16} className="text-brand-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 leading-none">{conversionRate}%</div>
            <div className="text-xs text-slate-500 mt-0.5">Hot lead rate</div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Top Objection</div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2.5">
          <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold text-amber-700">Most common</div>
            <div className="text-xs text-amber-600 mt-0.5 leading-relaxed">
              {stats.topObjection === "—" ? "None yet" : stats.topObjection}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Distribution</div>
        {stats.processed > 0 ? (
          <div className="space-y-2">
            {[
              { label: "Hot", val: stats.hot, max: stats.processed, color: "bg-green-500" },
              { label: "Warm", val: stats.warm, max: stats.processed, color: "bg-amber-400" },
              { label: "Cold", val: stats.cold, max: stats.processed, color: "bg-slate-300" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-10">{b.label}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`${b.color} h-1.5 rounded-full transition-all duration-700`}
                    style={{ width: `${b.max > 0 ? (b.val / b.max) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-slate-600 w-4">{b.val}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 text-center py-4">Waiting for data…</div>
        )}
      </div>

      <div className="bg-slate-800 rounded-xl p-3 text-center">
        <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Engine</div>
        <div className="text-green-400 text-xs font-medium font-mono">Convo-AI v2.1 ●</div>
        <div className="text-slate-500 text-[10px] mt-0.5">SEBI Compliant Mode</div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value, color, bg, border }: { icon: React.ReactNode; label: string; value: number; color: string; bg: string; border: string }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${bg} ${border}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium text-slate-700">{label}</span>
      </div>
      <span className={`text-lg font-bold font-mono ${color}`}>{value}</span>
    </div>
  );
}
