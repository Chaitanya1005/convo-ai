"use client";
import { X, MessageSquare, User, Cpu, Lightbulb, MapPin, IndianRupee } from "lucide-react";

interface Props {
  lead: any;
  onClose: () => void;
}

export default function LeadModal({ lead, onClose }: Props) {
const classificationColors: any = {

  Hot: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },

  Warm: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },

  Cold: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const c =
  classificationColors[lead.classification] ||
  classificationColors["Cold"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl border border-[#1D4ED8]/10 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center font-bold text-[#1D4ED8] text-sm">
              {lead.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-sm">{lead.name}</div>
              <div className="flex items-center gap-2 text-[10px] text-[#1D4ED8]/70 mt-0.5">
                <MapPin size={9} /> RM Lead · {lead.phone}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{lead.classification}
            </span>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-[#1D4ED8]/70 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* META */}
          <div className="grid grid-cols-2 gap-3 p-5 border-b border-slate-100">
            {[
  { label: "Lead ID", value: lead.displayId },

  { label: "Intent", value: lead.intent || "AP Partnership Interest" },

  {
    label: "Investment Range",
    value: lead.investment_range || "Not specified"
  },

  {
    label: "Partner Quality Index",
    value: `${lead.pqs_score}/10`
  },

  {
    label: "Objection",
    value: lead.objection || "None"
  },
].map((m) => (
              <div key={m.label} className="bg-white border border-[#1D4ED8]/10 hover:border-[#1D4ED8]/30 rounded-2xl p-4 transition-all duration-200 hover:shadow-md">
                <div className="text-[10px] font-semibold text-[#1D4ED8]/70 uppercase tracking-wider mb-1">{m.label}</div>
                <div className="text-xs text-slate-700 font-medium leading-snug">{m.value}</div>
              </div>
            ))}
          </div>

{/* CONVERSATION */}
<div className="p-5 border-b border-slate-100">
  <div className="flex items-center gap-2 mb-4">
    <MessageSquare
      size={15}
      className="text-slate-500"
    />

    <span className="text-sm font-semibold uppercase tracking-wide text-[#1D4ED8]">
      AI Conversation
    </span>
  </div>

  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
    {lead.conversation &&
    lead.conversation.length > 0 ? (

      lead.conversation.map(
        (
          msg: any,
          i: number
        ) => (

          <div
            key={i}
            className={`flex ${
              msg.sender === "AI"
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed  ${
                msg.sender === "AI"
                  ? "bg-[#1D4ED8]/5 border border-[#1D4ED8]/10 text-slate-700"
                  : "bg-[#1D4ED8] text-white"
              }`}
            >
              <div className="text-[10px] uppercase font-bold mb-1 opacity-70">
                {msg.sender === "AI"
                  ? "Convo-AI"
                  : lead.name}
              </div>

              <div>
                {msg.message}
              </div>
            </div>
          </div>
        )
      )

    ) : (

      <div className="text-sm text-[#1D4ED8]/70 italic">
        No conversation transcript available.
      </div>

    )}
  </div>
</div>

          {/* SUMMARY + ACTION */}
          <div className="p-5 space-y-3">
            <div className="bg-white border border-[#1D4ED8]/10 rounded-2xl p-4">
              <div className="text-[10px] font-semibold text-[#1D4ED8]/70 uppercase tracking-wider mb-1.5">AI Summary</div>
              <p className="text-xs text-slate-600 leading-relaxed">{lead.summary}</p>
            </div>
            <div className="bg-[#1D4ED8]/5 border border-[#1D4ED8]/15 rounded-xl p-3 flex items-start gap-2.5">
              <Lightbulb size={13} className="text-brand-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-brand-700 uppercase tracking-wider mb-1">Recommended Action</div>
                <p className="text-xs text-brand-600 leading-relaxed">{lead.recommended_action}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
