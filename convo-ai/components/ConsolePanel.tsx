"use client";
import { RefObject, useEffect } from "react";
import { Terminal, MessageSquare, AlertCircle, Cpu, CheckCircle2 } from "lucide-react";
import { LogEntry } from "@/app/workspace/page";
import { getStatusColor } from "@/lib/utils";

interface Props {
  logs: LogEntry[];
  currentIdx: number;
  isProcessing: boolean;
  logEndRef: RefObject<HTMLDivElement>;
}

function ConvoBlock({ data }: { data: NonNullable<LogEntry["data"]> }) {
  const colors = getStatusColor(data.status);
  return (
    <div className="mt-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <MessageSquare size={13} className="text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">{data.name}</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">{data.intent}</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {data.status}
        </span>
      </div>
      <div className="p-4 space-y-3">
        {data.conversation.slice(1, 4).map((msg: any, i: number) => {
  return (
    <div key={i} className={`flex gap-2.5 ${msg.sender === "AI" ? "" : "flex-row-reverse"}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
              msg.sender === "AI" ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-600"
            }`}>
              {msg.sender === "AI" ? "AI" : "U"}
            </div>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
              msg.sender === "AI"
                ? "bg-brand-50 text-brand-900 rounded-tl-none"
                : "bg-slate-100 text-slate-700 rounded-tr-none"
            }`}>
              {msg.message}
            </div>
          </div>
        );
      })}
      </div>
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
        <span className="text-xs text-slate-500 font-medium">Action: </span>
        <span className="text-xs text-slate-700">{data.recommendedAction}</span>
      </div>
    </div>
  );
}

const typeConfig = {
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
          <span className="text-xs font-semibold text-slate-300">AI Processing Console</span>
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
            <p>Console ready. Load leads and start processing.</p>
          </div>
        )}

        {logs.map((log) => {
          const cfg = typeConfig[log.type];
          const Icon = cfg.icon;
          return (
            <div key={log.id} className="console-entry">
              {log.type === "classification" && log.data ? (
                <div className="mb-3">
                  <div className="flex items-start gap-2.5 mb-1">
                    <span className={`text-[10px] font-bold ${cfg.color} opacity-60 mt-0.5 w-8`}>{cfg.label}</span>
                    <Icon size={12} className={`${cfg.color} mt-0.5 flex-shrink-0`} />
                    <span className={`${cfg.color} font-medium`}>{log.message}</span>
                  </div>
                  <div className="ml-[50px]">
                    <ConvoBlock data={log.data} />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <span className="text-[10px] font-bold text-slate-600 opacity-60 mt-0.5 w-8 flex-shrink-0">{cfg.label}</span>
                  <Icon size={12} className={`${cfg.color} mt-0.5 flex-shrink-0`} />
                  {log.type !== "system" && (
                    <span className="text-slate-500 text-[10px] font-medium mt-0.5 w-10 flex-shrink-0">{log.leadId}</span>
                  )}
                  <span className={`${log.type === "system" ? "text-slate-400" : "text-slate-300"} leading-relaxed`}>
                    {log.message}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-2 text-slate-500 mt-1">
            <span className="w-8" />
            <span className="typing-cursor text-brand-400"> </span>
          </div>
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
