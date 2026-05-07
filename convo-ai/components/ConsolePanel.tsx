"use client";
import { RefObject, useEffect } from "react";
import { Terminal, MessageSquare, AlertCircle, Cpu, CheckCircle2 } from "lucide-react";
import { LogEntry } from "@/app/workspace/page";

interface Props {
  logs: LogEntry[];
  currentIdx: number;
  isProcessing: boolean;
  logEndRef: RefObject<HTMLDivElement>;
}

const typeConfig = {
  lead: { icon: Cpu,
  color: "text-cyan-400",
  label: "LEAD"
},
  system:         { icon: Terminal,      color: "text-slate-400", label: "SYS" },
  info:           { icon: Cpu,           color: "text-brand-500", label: "INF" },
  objection:      { icon: AlertCircle,   color: "text-amber-500", label: "OBJ" },
  conversation:   { icon: MessageSquare, color: "text-purple-500", label: "CNV" },
  classification: { icon: CheckCircle2,  color: "text-green-500", label: "CLS" },
};

export default function ConsolePanel({ logs, isProcessing, logEndRef }: Props) {
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal size={13} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Convo-AI Operations Terminal</span>
          {isProcessing && (
            <div className="flex items-center gap-1.5 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400 font-medium">LIVE</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-900 p-4 font-mono text-xs space-y-1.5">
        {logs.length === 0 && (
          <div className="text-slate-600 text-center py-12">
            <Terminal size={24} className="mx-auto mb-3 opacity-40" />
            <p>Convo-AI agent ready. Upload lead batch to begin live processing.</p>
          </div>
        )}

{logs.map((log) => {

  const cfg = typeConfig[log.type];
  const Icon = cfg.icon;

  return (

    <div
      key={log.id}
      className={`flex items-start gap-3 ${
        log.type === "lead"
  ? ""
  : log.type === "system"
  ? ""
  : log.type === "classification"
  ? "ml-6"
  : "ml-12"
      }`}
    >

      <span
        className={`text-[10px] font-bold opacity-70 mt-0.5 w-10 flex-shrink-0 ${cfg.color}`}
      >
        {cfg.label}
      </span>

      <Icon
        size={12}
        className={`${cfg.color} mt-0.5 flex-shrink-0`}
      />

<div className="flex flex-col gap-2">

  <span
    className={`leading-relaxed text-xs ${
      log.type === "lead"
        ? "text-cyan-300 font-semibold"
        : log.type === "system"
        ? "text-slate-200 font-medium"
        : "text-slate-300"
    }`}
  >
    {log.message}
  </span>

  {log.action && (
    <button
      onClick={() => window.location.href = "/dashboard"}
      className="w-fit text-[11px] px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-all"
    >
      → {log.action}
    </button>
  )}

</div>

    </div>
  );
})}

{isProcessing && (
  <div className="flex items-center gap-2 text-slate-500 mt-2 pl-[4.5rem]">
    
    <div className="flex gap-1">
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.15s]" />
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.3s]" />
    </div>

    <span className="text-[11px] text-slate-500">
      AI agent processing...
    </span>

  </div>
)}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
