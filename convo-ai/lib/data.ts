import { SAMPLE_LEADS, processLead, ProcessedLead } from "@/data/mockLeads";

// Pre-process all leads once for static pages
export const ALL_PROCESSED_LEADS: ProcessedLead[] = SAMPLE_LEADS.map(processLead);

export const TOTAL   = ALL_PROCESSED_LEADS.length;
export const HOT     = ALL_PROCESSED_LEADS.filter((l) => l.status === "Hot").length;
export const WARM    = ALL_PROCESSED_LEADS.filter((l) => l.status === "Warm").length;
export const COLD    = ALL_PROCESSED_LEADS.filter((l) => l.status === "Cold").length;
export const CONVERSION_RATE = Math.round((HOT / TOTAL) * 100);

// Objection frequency map
export const OBJECTION_COUNTS: Record<string, number> = {};
ALL_PROCESSED_LEADS.forEach((l) => {
  OBJECTION_COUNTS[l.objection] = (OBJECTION_COUNTS[l.objection] || 0) + 1;
});
export const TOP_OBJECTIONS = Object.entries(OBJECTION_COUNTS)
  .sort((a, b) => b[1] - a[1]);

// Intent frequency map
export const INTENT_COUNTS: Record<string, number> = {};
ALL_PROCESSED_LEADS.forEach((l) => {
  INTENT_COUNTS[l.intent] = (INTENT_COUNTS[l.intent] || 0) + 1;
});
export const TOP_INTENTS = Object.entries(INTENT_COUNTS).sort((a, b) => b[1] - a[1]);

// City distribution
export const CITY_COUNTS: Record<string, number> = {};
ALL_PROCESSED_LEADS.forEach((l) => {
  CITY_COUNTS[l.city] = (CITY_COUNTS[l.city] || 0) + 1;
});
export const TOP_CITIES = Object.entries(CITY_COUNTS).sort((a, b) => b[1] - a[1]).slice(0, 6);

// Funnel
export const FUNNEL = [
  { label: "Total Reached",  count: TOTAL                   },
  { label: "Engaged",        count: Math.round(TOTAL * 0.87) },
  { label: "Interested",     count: HOT + WARM               },
  { label: "Hot Leads",      count: HOT                      },
];
