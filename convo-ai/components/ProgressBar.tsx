"use client";

interface Props {
  progress: number;
  stage: string;
  isProcessing: boolean;
}

export default function ProgressBar({
  progress,
  stage,
  isProcessing,
}: Props) {
  return (
    <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex items-center gap-4 flex-shrink-0">

      <div className="text-xs font-medium text-slate-500 w-36 flex-shrink-0">
        {stage}
      </div>

      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            progress === 100
              ? "bg-green-500"
              : isProcessing
              ? "bg-blue-500"
              : "bg-slate-300"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-xs font-mono font-semibold text-slate-600 w-12 text-right flex-shrink-0">
        {progress}%
      </div>

    </div>
  );
}