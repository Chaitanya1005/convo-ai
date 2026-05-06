"use client";
import { X, MessageSquare, User, Cpu, Lightbulb, MapPin, IndianRupee } from "lucide-react";
import { ProcessedLead } from "@/data/mockLeads";
import { getStatusColor } from "@/lib/utils";

interface Props {
  lead: ProcessedLead;
  onClose: () => void;
}

export default function LeadModal({ lead, onClose }: Props) {
  const c = getStatusColor(lead.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center font-bold text-brand-600 text-sm">
              {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-sm">{lead.name}</div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <MapPin size={9} /> {lead.city} · {lead.phone}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{lead.status}
            </span>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* META */}
          <div className="grid grid-cols-2 gap-3 p-5 border-b border-slate-100">
            {[
              { label: "Lead ID", value: lead.id },
              { label: "Intent", value: lead.intent },
              { label: "Investment Range", value: lead.investmentRange },
              { label: "Objection", value: lead.objection },
            ].map((m) => (
              <div key={m.label} className="bg-slate-50 rounded-xl p-3">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{m.label}</div>
                <div className="text-xs text-slate-700 font-medium leading-snug">{m.value}</div>
              </div>
            ))}
          </div>

          {/* CONVERSATION */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={13} className="text-slate-500" />
              <span className="text-xs font-bold text-slate-700">AI Conversation</span>
            </div>
            <div className="space-y-3">
              {lead.conversation.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.sender === "AI" ? "" : "flex-row-reverse"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${msg.sender === "AI" ? "bg-brand-100 text-brand-600" : "bg-slate-100 text-slate-600"}`}>
                    {msg.sender === "AI" ? <Cpu size={10} /> : <User size={10} />}
                  </div>
                  <div className={`max-w-[78%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.sender === "AI"
                      ? "bg-brand-50 text-brand-900 rounded-tl-none"
                      : "bg-slate-100 text-slate-700 rounded-tr-none"
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY + ACTION */}
          <div className="p-5 space-y-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">AI Summary</div>
              <p className="text-xs text-slate-600 leading-relaxed">{lead.summary}</p>
            </div>
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 flex items-start gap-2.5">
              <Lightbulb size={13} className="text-brand-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-brand-700 uppercase tracking-wider mb-1">Recommended Action</div>
                <p className="text-xs text-brand-600 leading-relaxed">{lead.recommendedAction}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
