export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  intent: string;
  objection: string;
  investmentRange: string;
}

export interface ProcessedLead extends Lead {
  status: "Hot" | "Warm" | "Cold";
  conversation: { sender: "AI" | "User"; message: string }[];
  summary: string;
  recommendedAction: string;
  processingTime: number;
}

export const SAMPLE_LEADS: Lead[] = [
  { id: "L001", name: "Rajesh Sharma", phone: "+91 98100 11234", city: "Mumbai", intent: "SIP Investment", objection: "Market is too risky right now", investmentRange: "₹25,000/mo" },
  { id: "L002", name: "Priya Mehta", phone: "+91 97300 22345", city: "Bengaluru", intent: "Direct Equity", objection: "I already have a broker", investmentRange: "₹2L lump sum" },
  { id: "L003", name: "Amit Verma", phone: "+91 96400 33456", city: "Delhi", intent: "IPO Access", objection: "Not sure about the platform", investmentRange: "₹50,000" },
  { id: "L004", name: "Sunita Rao", phone: "+91 95500 44567", city: "Hyderabad", intent: "Mutual Funds", objection: "Will think about it later", investmentRange: "₹10,000/mo" },
  { id: "L005", name: "Vikram Nair", phone: "+91 94600 55678", city: "Chennai", intent: "Retirement Planning", objection: "Already have LIC and FD", investmentRange: "₹1.5L/yr" },
  { id: "L006", name: "Kavya Patel", phone: "+91 93700 66789", city: "Ahmedabad", intent: "SIP Investment", objection: "No objection", investmentRange: "₹15,000/mo" },
  { id: "L007", name: "Suresh Iyer", phone: "+91 92800 77890", city: "Pune", intent: "Wealth Management", objection: "Brokerage is high", investmentRange: "₹10L lump sum" },
  { id: "L008", name: "Neha Gupta", phone: "+91 91900 88901", city: "Jaipur", intent: "Tax Saving ELSS", objection: "3 year lock-in is long", investmentRange: "₹1.5L" },
  { id: "L009", name: "Deepak Singh", phone: "+91 90000 99012", city: "Kolkata", intent: "Direct Equity", objection: "No objection", investmentRange: "₹5,000/mo" },
  { id: "L010", name: "Meera Krishnan", phone: "+91 89100 10123", city: "Kochi", intent: "SIP Investment", objection: "Market is too risky right now", investmentRange: "₹20,000/mo" },
  { id: "L011", name: "Arun Saxena", phone: "+91 88200 21234", city: "Lucknow", intent: "IPO Access", objection: "I already have a broker", investmentRange: "₹75,000" },
  { id: "L012", name: "Pooja Agarwal", phone: "+91 87300 32345", city: "Nagpur", intent: "Mutual Funds", objection: "No objection", investmentRange: "₹8,000/mo" },
  { id: "L013", name: "Rahul Bhatt", phone: "+91 86400 43456", city: "Surat", intent: "Wealth Management", objection: "Will think about it later", investmentRange: "₹50L corpus" },
  { id: "L014", name: "Anita Desai", phone: "+91 85500 54567", city: "Vadodara", intent: "Retirement Planning", objection: "Brokerage is high", investmentRange: "₹2,000/mo" },
  { id: "L015", name: "Karan Malhotra", phone: "+91 84600 65678", city: "Chandigarh", intent: "Direct Equity", objection: "Not sure about the platform", investmentRange: "₹3L lump sum" },
];

const AI_RESPONSES: Record<string, { ai: string; user: string }> = {
  "Market is too risky right now": {
    ai: "I completely understand your concern, Rajesh. The market feels volatile, but SIPs actually benefit from volatility through rupee cost averaging. Investors who started SIPs during 2020 Covid crash saw 3x returns by 2022. Your ₹25,000/month plan is about wealth building, not timing the market.",
    user: "Hmm, that's a good point about the 2020 crash. I hadn't thought about it that way.",
  },
  "I already have a broker": {
    ai: "That's great — having a broker means you already believe in investing! The question is whether you're getting the best deal. Rupeezy offers zero brokerage on delivery and ₹20 flat for F&O. Many clients run both accounts to compare execution quality. Would you like to see a cost comparison?",
    user: "Zero brokerage on delivery? That's actually interesting. My current broker charges 0.5%.",
  },
  "Not sure about the platform": {
    ai: "That's a fair concern. Rupeezy is SEBI-registered and has processed over ₹2,400 Cr in transactions. We're backed by Arihant Capital Markets. I can walk you through a live demo right now — takes just 3 minutes. Want to see the IPO dashboard?",
    user: "Okay, if it's SEBI registered I guess it's safe. Show me how IPO application works.",
  },
  "Will think about it later": {
    ai: "Totally understand! But here's a thought — the cost of waiting. ₹10,000/month started today at 12% returns = ₹1.2 Cr in 20 years. Starting 6 months later = ₹1.09 Cr. That's ₹11L lost by 'thinking about it'. What specific concern can I address today?",
    user: "When you put it in numbers like that... okay, what's the minimum I can start with?",
  },
  "Already have LIC and FD": {
    ai: "LIC and FD are great for safety, but here's the challenge — FD returns are 6-7%, inflation is 6-7%. You're essentially breaking even. ELSS and equity SIPs have delivered 14-18% CAGR over 10 years. Think of equity as your growth engine alongside your safety net.",
    user: "14-18%? My FD only gives 7%. What's the minimum risk option you have?",
  },
  "No objection": {
    ai: "Wonderful! Since you're ready to proceed, let me guide you through our quick KYC. It takes 7 minutes online — Aadhaar OTP + PAN verification. After that, your account is live and you can start your first SIP today. Shall we begin?",
    user: "Yes, let's do it! I'll keep my phone handy for the OTP.",
  },
  "Brokerage is high": {
    ai: "I hear you. Let's do a quick math — on ₹10L, traditional brokers at 0.5% charge ₹5,000 per trade. Rupeezy charges ₹20 flat. Over 20 trades a year, you save ₹96,000. That savings itself can become an SIP! Would a detailed fee comparison help?",
    user: "Wait, just ₹20 per trade regardless of size? That's really different from what I pay now.",
  },
  "3 year lock-in is long": {
    ai: "Three years sounds long but for ELSS, it's actually the shortest lock-in vs PPF (15 years) or NPS (till 60). Plus, you save up to ₹46,800 in tax under 80C. And historically, 3-year ELSS returns have been 15-22%. You're paid well to wait.",
    user: "Compared to PPF 15 years, 3 years is actually pretty short. What's the best ELSS fund right now?",
  },
};

const CLASSIFICATION_LOGIC: Record<string, ProcessedLead["status"]> = {
  "No objection": "Hot",
  "Market is too risky right now": "Warm",
  "I already have a broker": "Warm",
  "Not sure about the platform": "Warm",
  "Will think about it later": "Cold",
  "Already have LIC and FD": "Warm",
  "Brokerage is high": "Hot",
  "3 year lock-in is long": "Warm",
};

const RECOMMENDED_ACTIONS: Record<string, string> = {
  Hot: "Schedule onboarding call within 24 hours. Send KYC link.",
  Warm: "Send educational content + follow up in 3 days.",
  Cold: "Add to drip campaign. Re-engage in 2 weeks.",
};

const SUMMARIES: Record<string, string> = {
  "No objection": "Lead is ready to onboard. Expressed clear interest and willingness to proceed with KYC immediately.",
  "Market is too risky right now": "Lead is open to investing but has fear of volatility. Responded positively to SIP averaging concept.",
  "I already have a broker": "Lead already invested but showed interest in cost savings. High potential to switch or dual-account.",
  "Not sure about the platform": "Lead had trust concerns, addressed with SEBI credentials. Interested in IPO feature demo.",
  "Will think about it later": "Lead was fence-sitting; number-based urgency technique worked. Now asking about minimums — warm signal.",
  "Already have LIC and FD": "Risk-averse lead. Opened up to equity after understanding real returns vs inflation. Needs hand-holding.",
  "Brokerage is high": "Price-sensitive lead. Highly responsive to cost comparison. Strong conversion potential with fee calculator.",
  "3 year lock-in is long": "Tax-saver intent. Concerned about liquidity. Positively surprised by ELSS lock-in vs alternatives.",
};

export function processLead(lead: Lead): ProcessedLead {
  const responseKey = lead.objection as keyof typeof AI_RESPONSES;
  const convo = AI_RESPONSES[responseKey] || AI_RESPONSES["No objection"];
  const status = CLASSIFICATION_LOGIC[lead.objection] || "Cold";

  return {
    ...lead,
    status,
    conversation: [
      { sender: "AI", message: `Hi ${lead.name.split(" ")[0]}, I'm calling from Rupeezy about your interest in ${lead.intent}. Is this a good time?` },
      { sender: "User", message: lead.objection === "No objection" ? "Yes, please go ahead!" : `Actually, ${lead.objection.toLowerCase()}.` },
      { sender: "AI", message: convo.ai },
      { sender: "User", message: convo.user },
      { sender: "AI", message: "That's great! Let me send you our quick-start guide and KYC link. You can get started in under 10 minutes." },
    ],
    summary: SUMMARIES[lead.objection] || "Lead evaluated. Moderate interest detected.",
    recommendedAction: RECOMMENDED_ACTIONS[status],
    processingTime: Math.floor(Math.random() * 3) + 2,
  };
}
