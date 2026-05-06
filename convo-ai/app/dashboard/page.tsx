"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import LeadModal from "@/components/LeadModal";
import { ProcessedLead } from "@/data/mockLeads";
import { getStatusColor } from "@/lib/utils";
import { TrendingUp, Flame, Thermometer, Wind, ArrowLeft, ChevronRight, AlertTriangle, Users, Target, Layers, BarChart2 } from "lucide-react";
import ConsolePanel from "@/components/ConsolePanel";
import { useRef } from "react";
import ProgressBar from "@/components/ProgressBar";
import LeftPanel from "@/components/LeftPanel";
export default function DashboardPage() {
  const logEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({ hot: 0, warm: 0, cold: 0 });
  const [logs, setLogs] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<ProcessedLead | null>(null);
  const [filterStatus, setFilterStatus] = useState<"All" | "Hot" | "Warm" | "Cold">("All");
  const [file, setFileState] = useState<File | null>(null);
  const handleStartProcessing = async () => {
  try {
    setIsProcessing(true);

    const response = await fetch(
      "http://127.0.0.1:8000/api/process-leads/",
      {
        method: "POST",
      }
    );

    const data = await response.json();

    console.log("PROCESS DATA:", data);

    const results = data.results || [];

    const mappedLeads = results.map((r: any) => ({
      id: r.lead_id,
      name: "Lead " + r.lead_id,
      city: "—",
      intent: "—",
      objection: r.objection,
      status: r.classification,
    }));

    setLeads(mappedLeads);

    setProgress(data.processed || 0);
    setTotal(data.total || 0);

    const hot = results.filter((r: any) => r.classification === "Hot").length;
    const warm = results.filter((r: any) => r.classification === "Warm").length;
    const cold = results.filter((r: any) => r.classification === "Cold").length;

    setStats({ hot, warm, cold });

    const newLogs = results.map((r: any, index: number) => ({
      id: index,
      type: "classification",
      leadId: r.lead_id,
      message: `Lead ${r.lead_id} classified as ${r.classification}`,
      data: {
        name: "Lead " + r.lead_id,
        intent: "Trading",
        status: r.classification,
        objection: r.objection,
        conversation: [
          { sender: "AI", message: "Hello, trading karte ho?" },
          { sender: "User", message: r.objection },
          { sender: "AI", message: "Understood, let me help you..." }
        ],
        recommendedAction: r.next_action || "Follow up"
      }
    }));

    setLogs(newLogs);

    setCurrentIdx(results.length);

  } catch (error) {
    console.error("Processing failed", error);
  } finally {
    setIsProcessing(false);
    setLoading(false);
  }
};
  const setFile = (f: File) => {
    setFileState(f);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Upload CSV first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/api/upload-csv/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Upload success:", data);

      alert("CSV uploaded successfully");

    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const filteredLeads = filterStatus === "All" ? leads : leads.filter((l) => l.status === filterStatus);
  const conversionRate = leads.length > 0 ? Math.round((stats.hot / leads.length) * 100) : 0;

  const objectionCounts: Record<string, number> = {};
  leads.forEach((l) => { objectionCounts[l.objection] = (objectionCounts[l.objection] || 0) + 1; });
  const topObjections = Object.entries(objectionCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const funnel = [
    { label: "Total Reached", count: leads.length, color: "bg-brand-500" },
    { label: "Engaged", count: Math.round(leads.length * 0.82), color: "bg-brand-400" },
    { label: "Interested", count: stats.hot + stats.warm, color: "bg-amber-400" },
    { label: "Hot Leads", count: stats.hot, color: "bg-green-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* LEFT PANEL */}
          <div className="lg:col-span-1">
            <LeftPanel
            leadsLoaded={true}
            isProcessing={isProcessing}
            isDone={false}

            onLoad={() => {}}
            onStart={handleStartProcessing}
            onViewDashboard={() => {}}

            leadCount={leads.length}
            processedCount={progress}

            onUploadCSV={handleUpload}
            setFile={setFile}
          />
          </div>

          {/* MAIN AREA */}
          <div className="lg:col-span-3 space-y-6">

            <ProgressBar
              progress={progress}
              stage={isProcessing ? "Processing Leads..." : "Completed"}
              isProcessing={isProcessing}
            />

          </div>
        </div>
        <div className="h-[400px]">
          <ConsolePanel
            logs={logs}
            currentIdx={currentIdx}
            isProcessing={isProcessing}
            logEndRef={logEndRef}
          />
        </div>
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => router.push("/workspace")} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 mb-2 transition-colors">
              <ArrowLeft size={12} /> Back to Console
            </button>
            <h1 className="text-xl font-bold text-slate-800">Lead Processing Report</h1>
            <p className="text-sm text-slate-500 mt-0.5">Batch processed · {leads.length} leads · Convo-AI v2.1</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-green-700">
                {loading ? `Processing ${progress}/${total}` : "Processing Complete"}
              </span>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard icon={<Users size={18} className="text-brand-600" />} label="Total Leads" value={leads.length} sub="Processed this batch" color="bg-brand-50 border-brand-100" />
          <SummaryCard icon={<Flame size={18} className="text-green-600" />} label="Hot Leads" value={stats.hot} sub="Ready to onboard" color="bg-green-50 border-green-100" />
          <SummaryCard icon={<Target size={18} className="text-amber-600" />} label="Conversion Rate" value={`${conversionRate}%`} sub="Hot lead percentage" color="bg-amber-50 border-amber-100" />
          <SummaryCard icon={<TrendingUp size={18} className="text-purple-600" />} label="Warm Leads" value={stats.warm} sub="Follow up required" color="bg-purple-50 border-purple-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* FUNNEL */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={15} className="text-slate-500" />
              <h2 className="text-sm font-bold text-slate-700">Conversion Funnel</h2>
            </div>
            <div className="space-y-2">
              {funnel.map((stage, i) => (
                <div key={stage.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">{stage.label}</span>
                    <span className="text-xs font-bold font-mono text-slate-700">{stage.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden">
                    <div
                      className={`${stage.color} h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-700`}
                      style={{ width: `${leads.length > 0 ? (stage.count / leads.length) * 100 : 0}%` }}
                    >
                      <span className="text-white text-[10px] font-semibold">{leads.length > 0 ? Math.round((stage.count / leads.length) * 100) : 0}%</span>
                    </div>
                  </div>
                  {i < funnel.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ChevronRight size={12} className="text-slate-300 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TOP OBJECTIONS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={15} className="text-amber-500" />
              <h2 className="text-sm font-bold text-slate-700">Top Objections</h2>
            </div>
            <div className="space-y-3">
              {topObjections.map(([obj, count]) => (
                <div key={obj}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600 truncate max-w-[160px]" title={obj}>{obj}</span>
                    <span className="text-xs font-bold text-slate-700 ml-2">{count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-amber-400 h-1.5 rounded-full"
                      style={{ width: `${leads.length > 0 ? (count / leads.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STATUS BREAKDOWN */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={15} className="text-slate-500" />
              <h2 className="text-sm font-bold text-slate-700">Status Breakdown</h2>
            </div>
            <div className="flex items-end justify-around h-32 border-b border-slate-100 mb-3">
              {[
                { label: "Hot", val: stats.hot, color: "bg-green-500" },
                { label: "Warm", val: stats.warm, color: "bg-amber-400" },
                { label: "Cold", val: stats.cold, color: "bg-slate-300" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-xs font-bold text-slate-700">{b.val}</span>
                  <div className="w-10 rounded-t-lg flex-shrink-0" style={{ height: `${leads.length > 0 ? (b.val / leads.length) * 100 : 0}%`, backgroundColor: b.color === "bg-green-500" ? "#22c55e" : b.color === "bg-amber-400" ? "#fbbf24" : "#d1d5db" }} />
                </div>
              ))}
            </div>
            <div className="flex justify-around">
              {["Hot", "Warm", "Cold"].map((l) => (
                <span key={l} className="text-[10px] text-slate-500 font-medium">{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* LEAD TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-700">Lead Details</h2>
            <div className="flex gap-1">
              {(["All", "Hot", "Warm", "Cold"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterStatus === s ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {["Lead ID", "Name", "City", "Intent", "Objection", "Status", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, i) => {
                  const c = getStatusColor(lead.status);
                  return (
                    <tr key={lead.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${i % 2 === 0 ? "" : "bg-slate-50/50"}`} onClick={() => setSelectedLead(lead)}>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{lead.id}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-800">{lead.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{lead.city}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{lead.intent}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-[160px] truncate" title={lead.objection}>{lead.objection}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-brand-600 hover:text-brand-700 text-xs font-medium flex items-center gap-1">
                          View <ChevronRight size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredLeads.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">No leads found.</div>
            )}
          </div>
        </div>
      </div>

      {selectedLead && <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
}
{/* <div className="h-[400px]">
  <ConsolePanel
    logs={logs}
    currentIdx={currentIdx}
    isProcessing={isProcessing}
    logEndRef={logEndRef}
  />
</div> */}
function SummaryCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className={`bg-white rounded-2xl border p-4 flex items-start gap-3 ${color}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-slate-800 leading-none">{value}</div>
        <div className="text-xs font-semibold text-slate-700 mt-1">{label}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
