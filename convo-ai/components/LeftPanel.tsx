"use client";
import { Upload, Play, BarChart2, CheckCircle, Database, Users, Loader2 } from "lucide-react";

interface Props {
  isProcessing: boolean;
  leadCount: number;
  processedCount: number;
  selectedFileName?: string;
  onUploadCSV: (selectedFile?: File) => Promise<void>;
  onStartProcessing: () => Promise<void>;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}
export default function LeftPanel({
  isProcessing,
  leadCount,
  processedCount,
  onUploadCSV,
  onStartProcessing,
  setFile,
  selectedFileName
}: Props){
  return (
    <div className="p-4 space-y-6">
      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Data Source</div>
        <div className="space-y-2">
          <div className="flex flex-col gap-2">

  {/* FILE INPUT */}
  <label className="cursor-pointer">
  <input
    type="file"
    accept=".csv"
    className="hidden"
    onChange={async (e) => {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];

        setFile(selectedFile);

        // auto upload
        await onUploadCSV(selectedFile);
      }
    }}
  />

  <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 transition-all rounded-2xl p-5 bg-slate-50 hover:bg-brand-50/40">
    
    <div className="flex flex-col items-center text-center gap-2">
      <div className="w-12 h-8 rounded-2xl bg-white shadow-sm flex items-center justify-center">
        <Upload size={20} className="text-brand-600" />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700">
          Upload Lead CSV
        </p>

        <p className="text-xs text-slate-500 mt-1">
          Drag & drop or click to browse
        </p>
      </div>

      {selectedFileName && (
        <div className="mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          {selectedFileName}
        </div>
      )}
    </div>
  </div>
</label>

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
              <div className="flex justify-between items-center">
                <span>Status</span>

                <div className="flex items-center gap-1.5 text-green-600 font-semibold">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Ready
                </div>
              </div>       
            </div>
          </div>
      )}

      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Processing</div>
        <button
         onClick={onStartProcessing}
          disabled={isProcessing || leadCount === 0}
          className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
  isProcessing
    ? "bg-brand-600 text-white cursor-wait"
    : leadCount === 0
    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
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

      <div className="bg-brand-50 rounded-xl p-3 border border-brand-100">
        <div className="text-xs font-semibold text-brand-700 mb-1">Pro tip</div>
        <p className="text-xs text-brand-600/80 leading-relaxed">
          Hot leads should be called within 1 hour for 3x better conversion rates.
        </p>
      </div>
    </div>
  );
}
