"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import LeadModal from "@/components/LeadModal";

import {
  Users,
  Flame,
  Thermometer,
  Wind,
  TrendingUp,
  AlertTriangle,
  Target,
  Download,
  ChevronRight,
  Layers,
} from "lucide-react";
function SummaryCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  accent: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border p-4 flex items-start gap-3 transition-all duration-200 hover:shadow-md ${accent}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        {icon}
      </div>

      <div>
        <div className="text-2xl font-bold text-slate-800 leading-none">
          {value}
        </div>

        <div className="text-xs font-semibold text-slate-700 mt-1">
          {label}
        </div>

        <div className="text-[10px] text-slate-500 mt-0.5">
          {sub}
        </div>
      </div>
    </div>
  );
}

function HBar({
  label,
  count,
  max,
  color,
}: {
  label: string;
  count: number;
  max: number;
  color: string;
}) {

  const pct = max > 0
    ? Math.round((count / max) * 100)
    : 0;

  return (
    <div>

      <div className="flex items-center justify-between mb-1">

        <span className="text-xs text-slate-600 truncate max-w-[180px]">
          {label}
        </span>

        <span className="text-xs font-bold font-mono text-slate-700 ml-2">
          {count}
        </span>

      </div>

      <div className="w-full bg-slate-100 rounded-full h-2">

        <div
          className={`${color} h-2 rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />

      </div>

    </div>
  );
}
export default function DashboardPage() {

  const params = useParams();

  const sessionId = params.sessionId;

  const [data, setData] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [selectedLead, setSelectedLead] = useState<any>(null);

  useEffect(() => {

    async function fetchDashboard() {

      try {

        const response = await fetch(
          `https://convo-ai-backend-qg1y.onrender.com/api/dashboard/${sessionId}/`
        );

        const result = await response.json();

        setData(result);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    }

    fetchDashboard();

  }, [sessionId]);

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
      </div>
    );
  }

  if (!data) {

    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
      </div>
    );
  }

  const TOTAL = data.analytics.total;

  const HOT = data.analytics.hot;

  const WARM = data.analytics.warm;

  const COLD = data.analytics.cold;

  const AVG_PQI = data.analytics.avg_pqs;

  const CONVERSION_RATE =
    TOTAL > 0
      ? Math.round((HOT / TOTAL) * 100)
      : 0;

  const objectionCounts: Record<string, number> = {};

  data.leads.forEach((lead: any) => {

    if (lead.objection) {

      objectionCounts[lead.objection] =
        (objectionCounts[lead.objection] || 0) + 1;
    }
  });

  const TOP_OBJECTIONS = Object
    .entries(objectionCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5);

  return (

    <div className="min-h-screen bg-slate-50 flex flex-col">

      <Navbar />

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-xl font-bold text-slate-800">
              RM Intelligence Dashboard
            </h1>

            <p className="text-sm text-slate-500 mt-0.5">
              {data.session.name}
            </p>

          </div>

          <button
  onClick={() => {
    window.open(
      `https://convo-ai-backend-qg1y.onrender.com/api/dashboard/${sessionId}/export/`,
      "_blank"
    );
  }}
  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-all shadow-sm"
>
  <Download size={15} />
  Export CSV
</button>

        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">

<SummaryCard
  icon={<Users size={18} className="text-[#1D4ED8]" />}
  label="Total Leads"
  value={TOTAL}
  sub="This batch"
  accent="border-[#1D4ED8]/10 hover:border-[#1D4ED8]/20"
/>

<SummaryCard
  icon={<Flame size={18} className="text-green-600" />}
  label="Hot Leads"
  value={HOT}
  sub="Ready to onboard"
  accent="border-green-200 hover:border-green-300"
/>

<SummaryCard
  icon={<Thermometer size={18} className="text-amber-600" />}
  label="Warm Leads"
  value={WARM}
  sub="Needs follow-up"
  accent="border-amber-200 hover:border-amber-300"
/>

<SummaryCard
  icon={<TrendingUp size={18} className="text-[#1D4ED8]" />}
  label="Conversion Rate"
  value={`${CONVERSION_RATE}%`}
  sub="Hot lead %"
  accent="border-[#1D4ED8]/10 hover:border-[#1D4ED8]/20"
/>

<SummaryCard
  icon={<Target size={18} className="text-[#1D4ED8]" />}
  label="Partner Quality Index"
  value={`${AVG_PQI}/10`}
  sub="Average lead quality"
  accent="border-[#1D4ED8]/10 hover:border-[#1D4ED8]/20"
/>

        </div>
                {/* ANALYTICS ROW */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* STATUS DISTRIBUTION */}

          <div className="bg-white rounded-3xl border border-[#1D4ED8]/10 hover:border-[#1D4ED8]/20 transition-all duration-200 hover:shadow-md p-6">

            <div className="flex items-center gap-2 mb-4">

              <Layers size={15} className="text-slate-500" />

              <h2 className="text-sm font-bold text-slate-700">
                Status Distribution
              </h2>

            </div>

            <div className="flex items-end justify-around h-40 border-b border-slate-100 mb-4">

              {[
                { label: "Hot", val: HOT, color: "bg-green-500" },
                { label: "Warm", val: WARM, color: "bg-amber-400" },
                { label: "Cold", val: COLD, color: "bg-slate-300" },
              ].map((item) => (

                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 flex-1"
                >

                  <span className="text-xs font-bold text-slate-700">
                    {item.val}
                  </span>

                  <div
                    className={`${item.color} w-14 rounded-t-xl transition-all duration-700`}
                    style={{
                      height: `${TOTAL > 0 ? (item.val / TOTAL) * 140 : 0}px`
                    }}
                  />

                  <span className="text-xs text-slate-500">
                    {item.label}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* TOP OBJECTIONS */}

          <div className="bg-white rounded-3xl border border-[#1D4ED8]/10 hover:border-[#1D4ED8]/20 transition-all duration-200 hover:shadow-md p-6">

            <div className="flex items-center gap-2 mb-4">

              <AlertTriangle size={15} className="text-amber-500" />

              <h2 className="text-sm font-bold text-slate-700">
                Top Objections
              </h2>

            </div>

            <div className="space-y-4">

              {TOP_OBJECTIONS.map(([obj, count]) => (

                <HBar
                  key={obj}
                  label={obj}
                  count={count as number}
                  max={TOTAL}
                  color="bg-amber-400"
                />

              ))}

            </div>

          </div>

        </div>

        {/* LEAD TABLE */}

        <div className="bg-white rounded-3xl border border-[#1D4ED8]/10 overflow-hidden shadow-sm">

          <div className="px-6 py-5 border-b border-[#1D4ED8]/10 bg-[#1D4ED8]/[0.03] flex items-center justify-between">

            <h2 className="text-sm font-bold text-slate-700">
              Lead Intelligence
            </h2>

            <div className="text-xs text-slate-500">
              {data.leads.length} leads processed
            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-[#1D4ED8]/[0.03] border-b border-[#1D4ED8]/10">

                  {[
                    "Lead ID",
                    "Lead",
                    "Classification",
                    "PQI",
                    "Objection",
                    "Action",
                    "",
                  ].map((h) => (

                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {data.leads.map((lead: any, i: number) => (

                  <tr
                    key={lead.id}
                    className={`border-b border-[#1D4ED8]/5 hover:bg-[#1D4ED8]/[0.025] transition-colors ${
                      ""
                    }`}
                  >
<td className="px-4 py-3">
  <div className="font-bold text-[#1D4ED8] font-mono text-lg">
    L{String(i + 1).padStart(3, "0")}
  </div>
</td>

<td className="px-4 py-3">

  <div className="text-sm font-semibold text-slate-800">
    {lead.name}
  </div>

  <div className="text-[11px] text-slate-500 mt-0.5">
    {lead.phone}
  </div>

</td>

<td>
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold border
    ${
      lead.classification === "Hot"
        ? "bg-green-50 text-green-700 border-green-200"
        : lead.classification === "Warm"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-slate-50 text-slate-700 border-slate-200 "
    }`}
  >
    {lead.classification}
  </span>
</td>

                    <td className="px-4 py-3 text-sm font-semibold">
                      {lead.pqs_score}/10
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600 max-w-[220px] truncate">
                      {lead.objection || "—"}
                    </td>

<td className="text-sm font-medium">
  <span
    className={`inline-flex px-3 py-1.5 rounded-xl text-xs font-medium
    ${
      lead.classification === "Hot"
        ? "bg-green-50 text-green-700"
        : lead.classification === "Warm"
        ? "bg-amber-50 text-amber-700"
        : "bg-[#1D4ED8]/5 text-slate-700 border border-[#1D4ED8]/10"
    }`}
  >
    {lead.recommended_action}
  </span>
</td>

                    <td className="px-4 py-3">

                      <button
                        onClick={() => setSelectedLead({
                            ...lead,
                            displayId: `L${String(i + 1).padStart(3, "0")}`
                          })}
                        className="inline-flex items-center gap-1 text-[#1D4ED8] font-semibold hover:underline  font-semibold text-sm hover:underline transition-all"
                      >

                        View

                        <ChevronRight size={11} />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

    </div>
  );
}