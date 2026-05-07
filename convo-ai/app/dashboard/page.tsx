"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

import {
  FolderKanban,
  ChevronRight,
  Clock3,
  Database,
} from "lucide-react";

export default function DashboardHomePage() {

  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchSessions() {

      try {

        const response = await fetch(
          "process.env.NEXT_PUBLIC_API_URL/api/sessions/"
        );

        const data = await response.json();

        setSessions(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    }

    fetchSessions();

  }, []);

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#1D4ED8]/[0.03]">

      <Navbar />

      <div className="flex h-[calc(100vh-56px)]">

{/* LEFT SIDEBAR */}

<div className="w-[360px] border-r border-[#1D4ED8]/10 bg-white/80 backdrop-blur overflow-y-auto">

  <div className="p-6 border-b border-[#1D4ED8]/10 bg-[#1D4ED8]/[0.03]">

    <div className="flex items-center gap-3">

      <div className="w-11 h-11 rounded-2xl bg-[#1D4ED8]/10 flex items-center justify-center">
        <Database size={20} className="text-[#1D4ED8]" />
      </div>

      <div>

        <h1 className="text-xl font-bold text-slate-800">
          Previous Sessions
        </h1>

        <p className="text-xs text-slate-500 mt-1">
          Historical AI lead processing batches
        </p>

      </div>

    </div>

  </div>

  <div className="p-3 space-y-3">

            {sessions.map((session) => (

<Link
  key={session.id}
  href={`/dashboard/${session.id}`}
  className="group block bg-white border border-[#1D4ED8]/10 hover:border-[#1D4ED8]/30 rounded-2xl p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]"
>

<div className="flex items-start justify-between">

  <div className="flex items-start gap-3">

    <div className="w-10 h-10 rounded-xl bg-[#1D4ED8]/10 flex items-center justify-center flex-shrink-0">
      <FolderKanban size={18} className="text-[#1D4ED8]" />
    </div>

    <div>

      <div className="text-sm font-semibold text-slate-800 line-clamp-1">
        {session.name}
      </div>

      <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">

        <Clock3 size={11} />

        <span>
          {session.lead_count} leads processed
        </span>

      </div>

    </div>

  </div>

  <ChevronRight
    size={16}
    className="text-slate-400 group-hover:text-[#1D4ED8] transition-colors"
  />

</div>
              </Link>

            ))}

          </div>

        </div>

  <div className="flex-1 flex items-center justify-center relative overflow-hidden">

  <div className="absolute w-[500px] h-[500px] bg-[#1D4ED8]/[0.04] blur-3xl rounded-full" />

  <div className="relative z-10 text-center max-w-lg px-6">

  <div className="w-20 h-20 rounded-3xl bg-[#1D4ED8]/10 flex items-center justify-center mx-auto mb-6 shadow-sm">

    <Database
      size={34}
      className="text-[#1D4ED8]"
    />

  </div>

  <h2 className="text-4xl font-bold text-slate-800 tracking-tight">
    Select a session
  </h2>

  <p className="text-base text-slate-500 mt-4 leading-relaxed">
    Open a previous AI lead processing batch to view
    RM intelligence, transcripts, analytics,
    objections, and qualification insights.
  </p>

  <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-[#1D4ED8]/10 text-sm text-slate-600 shadow-sm">

    <div className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />

    AI dashboards ready for inspection

  </div>

</div>
          </div>

        </div>

      </div>
  )}