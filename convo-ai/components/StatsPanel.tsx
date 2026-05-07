"use client";
import { Flame, Thermometer, Wind, TrendingUp, ShieldCheck } from "lucide-react";
import { Stats } from "@/app/workspace/page";

interface Props {
  stats: Stats;
}

export default function StatsPanel({ stats }: Props) {
  const conversionRate = stats.processed > 0 ? Math.round((stats.hot / stats.processed) * 100) : 0;

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Live Stats</div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Leads Processed</span>
            <span className="text-xs font-bold text-slate-800 font-mono">{stats.processed}/{stats.total}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${stats.total > 0 ? (stats.processed / stats.total) * 100 : 0}%` }}
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
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Partner Qualification
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={18} className="text-cyan-600" />
                </div>

                <div className="flex-1">
                  <div className="text-2xl font-bold text-slate-800 leading-none">
                    {stats.avgPqs || 0}/10
                  </div>

                  <div className="text-xs text-slate-500 mt-0.5">
                    Partner Quality Index
                  </div>
                </div>
              </div>
            </div>
          </div>
   );
}

function StatRow({ icon, label, value, color, bg, border }: { icon: React.ReactNode; label: string; value: number; color: string; bg: string; border: string }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${bg} ${border}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium text-slate-700">{label}</span>
      </div>
      <span className={`text-lg font-bold font-mono ${color}`}>{value}</span>
    </div>
  );
}
