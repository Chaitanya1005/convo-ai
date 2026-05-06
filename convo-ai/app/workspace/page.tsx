"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import LeftPanel from "@/components/LeftPanel";
import ConsolePanel from "@/components/ConsolePanel";
import StatsPanel from "@/components/StatsPanel";
import ProgressBar from "@/components/ProgressBar";
import { delay } from "@/lib/utils";

export type LogEntry = {
  id: string;
  type: "info" | "objection" | "conversation" | "classification" | "system";
  leadId: string;
  leadName: string;
  message: string;
  data?: any;
};

export type Stats = {
  hot: number;
  warm: number;
  cold: number;
  processed: number;
  total: number;
  avgPqs: number;
  topObjection: string;
};

export default function WorkspacePage() {
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoaded, setLeadsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [processedLeads, setProcessedLeads] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stats, setStats] = useState<Stats>({
  hot: 0,
  warm: 0,
  cold: 0,
  processed: 0,
  total: 0,
  avgPqs: 0,
  topObjection: "—",
});
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Idle");
  const [file, setFile] = useState<File | null>(null);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current)
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (entry: Omit<LogEntry, "id">) => {
    setLogs((prev) => [...prev, { ...entry, id: crypto.randomUUID() }]);
  };
  const fetchLeads = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/leads/");
    const data = await res.json();

    console.log("DB Leads:", data);

    setLeads(data);
    setLeadsLoaded(true);

    return data;

  } catch (err) {
    console.error("Error fetching leads:", err);
  }
};

  const uploadCSV = async () => {
  if (!file) {
    alert("Please select a CSV file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:8000/api/upload-csv/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Upload response:", data);

    //  IMPORTANT
     await fetchLeads();// new leads load karega DB se
  } catch (err) {
    console.error("Upload error:", err);
  }
};

const startProcessing = async () => {
  if (isProcessing) return;

  setIsProcessing(true);
  setStage("Processing Leads...");
  setLogs([]);

  addLog({
    type: "system",
    leadId: "SYS",
    leadName: "System",
    message: "AI processing started...",
  });

  try {
    const response = await fetch("http://127.0.0.1:8000/api/process-leads/", {
      method: "POST",
    });

    const data = await response.json();
    

    console.log("PROCESS RESPONSE:", data);

    const processed = data.results || [];

    setProcessedLeads(processed);

    let hot = 0;
    let warm = 0;
    let cold = 0;

    processed.forEach((lead: any, index: number) => {
      const cls = lead.classification?.toLowerCase();

      if (cls === "hot") hot++;
      else if (cls === "warm") warm++;
      else cold++;

      addLog({
  type: "classification",
  leadId: String(lead.id),
  leadName: lead.name,
  message: `${lead.name} classified as ${lead.classification}`,

  data: {
    name: lead.name,
    intent: lead.intent || "Investment",
    classification: lead.classification,
    conversation: lead.conversation || [],
    recommendedAction: lead.recommended_action || "Follow up",
    pqs_score: lead.pqs_score || 5,
  }
});

      setProgress(Math.round(((index + 1) / processed.length) * 100));
    });

    setStats({
      hot,
      warm,
      cold,
      processed: processed.length,
      total: processed.length,
      avgPqs: data.analytics.avg_pqs,
      topObjection: data.analytics.top_objection || "—",
    });

    setStage("Completed");
    setIsDone(true);

    addLog({
      type: "system",
      leadId: "SYS",
      leadName: "System",
      message: "All leads processed successfully.",
    });

  } catch (err) {
    console.error(err);

    addLog({
      type: "system",
      leadId: "ERR",
      leadName: "System",
      message: "Processing failed.",
    });
  }

  setIsProcessing(false);
};

  const goToDashboard = () => {
    sessionStorage.setItem("processedLeads", JSON.stringify(processedLeads));
    sessionStorage.setItem("stats", JSON.stringify(stats));
    router.push("/dashboard");
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r bg-white overflow-y-auto">
          <LeftPanel
            isProcessing={isProcessing}
            leadCount={leads.length}
            processedCount={stats.processed}
            onUploadCSV={uploadCSV}
            onStartProcessing={startProcessing}
            setFile={setFile}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ConsolePanel
            logs={logs}
            currentIdx={currentIdx}
            isProcessing={isProcessing}
            logEndRef={logEndRef}
          />
          <ProgressBar
            progress={progress}
            stage={stage}
            isProcessing={isProcessing}
          />
        </div>

        <div className="w-72 border-l bg-white overflow-y-auto">
          <StatsPanel stats={stats} />
        </div>
      </div>
    </div>
  );
}