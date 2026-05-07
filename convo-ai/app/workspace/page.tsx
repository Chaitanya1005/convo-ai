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
  type: "info" | "objection" | "conversation" | "classification" | "system" | "lead";
  leadId: string;
  leadName: string;
  message: string;
 data?: any;
action?: string;
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
    const res = await fetch("http://https://convo-ai-backend-qg1y.onrender.com/api/leads/");
    const data = await res.json();

    console.log("DB Leads:", data);

    setLeads(data);
    setLeadsLoaded(true);

    return data;

  } catch (err) {
    console.error("Error fetching leads:", err);
  }
};

const uploadCSV = async (selectedFile?: File) => {

  const fileToUpload = selectedFile || file;

  if (!fileToUpload) {
    alert("Please select a CSV file");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileToUpload);

  try {
setLogs([]);


    const res = await fetch("http://https://convo-ai-backend-qg1y.onrender.com/api/upload-csv/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    addLog({
      type: "system",
      leadId: "SYS",
      leadName: "System",
      message: `${data.count} leads imported successfully.`,
    });

    await fetchLeads();

  } catch (err) {

    console.error("Upload error:", err);

    addLog({
      type: "system",
      leadId: "ERR",
      leadName: "System",
      message: "CSV upload failed.",
    });
  }
};

const startProcessing = async () => {
  let sessionId: number | null = null;
  if (leads.length === 0) {

  addLog({
    type: "system",
    leadId: "SYS",
    leadName: "System",
    message: "No lead batch found. Upload CSV before starting AI processing.",
  });

  return;
}
  if (isProcessing) return;

  setIsProcessing(true);
  setLogs([]);

setProgress(0);

setStats({
  hot: 0,
  warm: 0,
  cold: 0,
  processed: 0,
  total: leads.length,
  avgPqs: 0,
  topObjection: "—",
});
  setStage("Processing Leads...");

  addLog({
    type: "system",
    leadId: "SYS",
    leadName: "System",
    message: "AI processing started...",
  });

  try {
    const response = await fetch("https://convo-ai-backend-qg1y.onrender.com/api/process-leads/", {
      method: "POST",
    });

    const data = await response.json();
    sessionId = data.session_id;
    

    console.log("PROCESS RESPONSE:", data);

    const processed = data.results || [];

    setProcessedLeads(processed);

    let hot = 0;
    let warm = 0;
    let cold = 0;
    let totalPqs = 0;

for (let index = 0; index < processed.length; index++) {

  const lead = processed[index];
  const leadCode = `L${String(index + 1).padStart(3, "0")}`;

  // LEAD HEADER
  addLog({
    type: "lead",
    leadId: leadCode,
    leadName: lead.name,
    message: `Calling ${leadCode}...`,
  });

  await delay(1000);

  // TEMP STATUS
  const tempId = crypto.randomUUID();

  setLogs((prev) => [
    ...prev,
    {
      id: tempId,
      type: "info",
      leadId: leadCode,
      leadName: lead.name,
      message: "Convo-AI agent connected",
    },
  ]);

  await delay(2200);

  setLogs((prev) =>
    prev.map((log) =>
      log.id === tempId
        ? {
            ...log,
            message: "Language detected: Hindi / Hinglish",
          }
        : log
    )
  );

  await delay(2200);

  setLogs((prev) =>
    prev.map((log) =>
      log.id === tempId
        ? {
            ...log,
            message: "AP program benefits introduced",
          }
        : log
    )
  );

  await delay(2200);

  setLogs((prev) =>
    prev.map((log) =>
      log.id === tempId
        ? {
            ...log,
            message: `Objection handled: ${lead.objection}`,
          }
        : log
    )
  );

  await delay(2200);

  const cls = lead.classification?.toLowerCase();
  totalPqs += Number(lead.pqs_score || 0);

  if (cls === "hot") hot++;
  else if (cls === "warm") warm++;
  else cold++;

  // FINAL STATE
  setLogs((prev) =>
    prev.map((log) =>
      log.id === tempId
        ? {
            ...log,
            type: "classification",
            message: `Lead classified as ${lead.classification} • PQS: ${lead.pqs_score}/10`,
          }
        : log
    )
  );

setStats({
  hot,
  warm,
  cold,
  processed: index + 1,
  total: processed.length,
  avgPqs: Number((totalPqs / (index + 1)).toFixed(1)),
  topObjection: data.analytics.top_objection || "—",
});

  setProgress(
    Math.round(((index + 1) / processed.length) * 100)
  );

  await delay(2500);
}

    setStats({
      hot,
      warm,
      cold,
      processed: processed.length,
      total: processed.length,
      avgPqs: Number((totalPqs / processed.length).toFixed(1)),
      topObjection: data.analytics.top_objection || "—",
    });

    setStage("All leads processed");
    setIsDone(true);

addLog({
  type: "system",
  leadId: "SYS",
  leadName: "System",
  message:
    "Convo-AI lead processing completed. RM dashboard and lead intelligence reports are ready.",
  action: "Open RM Dashboard",
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
  if (sessionId) {

  setTimeout(() => {
  }, 2000);

}
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
            selectedFileName={file?.name}
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

        <div className="w-72 border-l bg-white">
          <StatsPanel stats={stats} />
        </div>
      </div>
    </div>
  );
}