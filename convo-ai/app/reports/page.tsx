"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ALL_PROCESSED_LEADS, TOTAL, HOT, WARM, COLD } from "@/lib/data";
import { ProcessedLead } from "@/data/mockLeads";
import { getStatusColor } from "@/lib/utils";
import { Download, Filter, ChevronRight, FileText, CheckCircle2, Thermometer, Wind, Flame } from "lucide-react";
import LeadModal from "@/components/LeadModal";

type StatusFilter = "All" | "Hot" | "Warm" | "Cold";

export default function ReportsPage() {
  const [filter, setFilter]           = useState<StatusFilter>("All");
  const [selected, setSelected]       = useState<ProcessedLead | null>(null);
  const [exportDone, setExportDone]   = useState(false);

  const filtered = filter === "All" ? ALL_PROCESSED_LEADS : ALL_PROCESSED_LEADS.filter((l) => l.status === filter);

  const handleExport = () => {
    // Build CSV string
    const header = ["Lead ID", "Name", "Phone", "City", "Intent", "Investment Range", "Status", "Objection", "Recommended Action"].join(",");
    const rows = ALL_PROCESSED_LEADS.map((l) =>
      [l.id, `"${l.name}"`, l.phone, l.city, `"${l.intent}"`, `"${l.investmentRange}"`, l.status, `"${l.objection}"`, `"${l.recommendedAction}"`].join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "convo-ai-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2500);
  };

  const FILTER_OPTS: { label: StatusFilter; count: number; icon: React.ReactNode; accent: string }[] = [
    { label: "All",  count: TOTAL, icon: <Filter size={13} />,         accent: filter === "All"  ? "bg-brand-600 text-white border-brand-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300" },
    { label: "Hot",  count: HOT,   icon: <Flame size={13} />,          accent: filter === "Hot"  ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300" },
    { label: "Warm", count: WARM,  icon: <Thermometer size={13} />,    accent: filter === "Warm" ? "bg-amber-500 text-white border-amber-500" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300" },
    { label: "Cold", count: COLD,  icon: <Wind size={13} />,           accent: filter === "Cold" ? "bg-slate-600 text-white border-slate-600" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* PAGE HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Reports</h1>
            <p className="text-sm text-slate-500 mt-0.5">Full lead processing report · {TOTAL} leads</p>
          </div>
          <button
            onClick={handleExport}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              exportDone
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-white border-slate-200 text-slate-700 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50"
            }`}
          >
            {exportDone ? <CheckCircle2 size={15} /> : <Download size={15} />}
            {exportDone ? "Exported!" : "Export CSV"}
          </button>
        </div>

        {/* STAT STRIP */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total",    val: TOTAL, color: "text-slate-800",  bg: "bg-white"       },
            { label: "Hot",      val: HOT,   color: "text-green-700",  bg: "bg-green-50"    },
            { label: "Warm",     val: WARM,  color: "text-amber-700",  bg: "bg-amber-50"    },
            { label: "Cold",     val: COLD,  color: "text-slate-600",  bg: "bg-slate-100"   },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl border border-slate-200 px-4 py-3 text-center`}>
              <div className={`text-2xl font-bold ${s.color} leading-none`}>{s.val}</div>
              <div className="text-[10px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FILTER + TABLE CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* toolbar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 flex-wrap gap-3">
            <div className="flex items-center gap-1">
              {FILTER_OPTS.map(({ label, count, icon, accent }) => (
                <button
                  key={label}
                  onClick={() => setFilter(label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${accent}`}
                >
                  {icon}
                  {label}
                  <span className={`ml-0.5 text-[10px] font-bold opacity-70`}>({count})</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FileText size={12} />
              Showing {filtered.length} of {TOTAL} leads
            </div>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["Lead ID", "Name", "City", "Status", "Objection", "Suggested Action", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => {
                  const c = getStatusColor(lead.status);
                  return (
                    <tr
                      key={lead.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${i % 2 === 0 ? "" : "bg-slate-50/40"}`}
                      onClick={() => setSelected(lead)}
                    >
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{lead.id}</td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-semibold text-slate-800">{lead.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{lead.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{lead.city}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-[180px] truncate" title={lead.objection}>{lead.objection}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-[200px] truncate" title={lead.recommendedAction}>{lead.recommendedAction}</td>
                      <td className="px-4 py-3">
                        <button className="text-brand-600 hover:text-brand-700 text-xs font-medium flex items-center gap-0.5">
                          View <ChevronRight size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400 text-sm">No leads found for this filter.</div>
            )}
          </div>

          {/* footer */}
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            <span className="text-xs text-slate-400">Click any row to view full conversation</span>
          </div>
        </div>
      </div>

      {selected && <LeadModal lead={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
