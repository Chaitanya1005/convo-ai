"use client";
import { Upload, Play, BarChart2, CheckCircle, Database, Users, Loader2 } from "lucide-react";

interface Props {
  isProcessing: boolean;
  leadCount: number;
  processedCount: number;
  onUploadCSV: () => Promise<void>;
  onStartProcessing: () => Promise<void>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}
export default function LeftPanel({
  isProcessing,
  leadCount,
  processedCount,
  onUploadCSV,
  onStartProcessing,
  setFile
}: Props){
  return (
    <div className="p-4 space-y-6">
      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Data Source</div>
        <div className="space-y-2">
          <div className="flex flex-col gap-2">

  {/* FILE INPUT */}
  <input
    type="file"
    accept=".csv"
    className="text-xs"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    }}
  />
<button
  onClick={onUploadCSV}
  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-dashed border-slate-200 text-slate-700 text-sm hover:bg-slate-50"
>
  <Upload size={14} />
  Upload CSV
</button>
  {/* BUTTON */}
  

</div>

        </div>
      </div>

      {leadCount > 0 && (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Users size={13} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">Lead File</span>
          </div>
          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Total leads</span>
              <span className="font-mono font-semibold text-slate-700">{leadCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Processed</span>
              <span className="font-mono font-semibold text-brand-600">{processedCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Source</span>
              <span className="text-slate-500">Live Backend</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Processing</div>
        <button
         onClick={onStartProcessing}
          disabled={isProcessing}
          className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
            isProcessing
              ? "bg-brand-600 text-white cursor-wait"
              : "bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md"
          }`}
        >
          {isProcessing ? (
            <><Loader2 size={15} className="animate-spin" /> Processing…</>
          ) : (
            <><Play size={15} /> Start Processing</>
          )}
        </button>
      </div>

      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Settings</div>
        <div className="space-y-1">
          {[
            { label: "Processing speed", value: "Normal" },
            { label: "AI model", value: "Convo v2.1" },
            { label: "Language", value: "English" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-slate-500">{item.label}</span>
              <span className="text-xs font-medium text-slate-700">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-50 rounded-xl p-3 border border-brand-100">
        <div className="text-xs font-semibold text-brand-700 mb-1">Pro tip</div>
        <p className="text-xs text-brand-600/80 leading-relaxed">
          Hot leads should be called within 1 hour for 3x better conversion rates.
        </p>
      </div>
    </div>
  );
}
