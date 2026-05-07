"use client";

import Navbar from "@/components/Navbar";
import TestAgentChat from "@/components/TestAgentChat";

export default function TestAgentPage() {

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#1D4ED8]/[0.05]">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-4 h-[calc(100vh-56px)] overflow-hidden flex flex-col min-h-0">

        <div className="mb-5">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D4ED8]/10 text-[#1D4ED8] text-sm font-medium border border-[#1D4ED8]/10">

            Live AI Agent Demo

          </div>

        </div>

        <TestAgentChat />

      </div>

    </div>
  );
}