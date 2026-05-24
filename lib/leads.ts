import fs from "fs";
import path from "path";
import type { LeadDoc } from "@/lib/models";

export interface ChatMessage { role: "user" | "assistant"; content: string }
export interface Lead {
  id: string; name: string; phone: string;
  timestamp: string; chatLog: ChatMessage[];
}

const LEADS_PATH = path.join(process.cwd(), "data", "leads.json");

// ── File helpers ──────────────────────────────────────────────────

function readFromFile(): Lead[] {
  try { return JSON.parse(fs.readFileSync(LEADS_PATH, "utf-8")) as Lead[]; }
  catch { return []; }
}

function writeToFile(leads: Lead[]): void {
  const dir = path.dirname(LEADS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2), "utf-8");
}

// ── Public API ────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  if (process.env.MONGODB_URI) {
    try {
      const { connectDB } = await import("@/lib/db");
      const { LeadModel } = await import("@/lib/models");
      await connectDB();
      const docs = await LeadModel.find().sort({ createdAt: -1 }).lean();
      return docs.map((d: LeadDoc & { createdAt: Date }) => ({
        id:        String(d._id),
        name:      d.name,
        phone:     d.phone,
        timestamp: d.createdAt.toISOString(),
        chatLog:   d.chatLog as ChatMessage[],
      }));
    } catch (err) {
      console.error("[MongoDB] getLeads failed:", err);
    }
  }
  return readFromFile();
}

export async function addLead(
  data: Pick<Lead, "name" | "phone" | "chatLog">
): Promise<Lead> {
  if (process.env.MONGODB_URI) {
    try {
      const { connectDB } = await import("@/lib/db");
      const { LeadModel } = await import("@/lib/models");
      await connectDB();
      const doc = await LeadModel.create({
        name:    data.name    || "Unknown",
        phone:   data.phone   || "Unknown",
        chatLog: data.chatLog ?? [],
      });
      return {
        id:        String(doc._id),
        name:      doc.name,
        phone:     doc.phone,
        timestamp: (doc as unknown as { createdAt: Date }).createdAt.toISOString(),
        chatLog:   doc.chatLog as ChatMessage[],
      };
    } catch (err) {
      console.error("[MongoDB] addLead failed:", err);
    }
  }
  const leads = readFromFile();
  const newLead: Lead = {
    id:        Date.now().toString(),
    name:      data.name    || "Unknown",
    phone:     data.phone   || "Unknown",
    timestamp: new Date().toISOString(),
    chatLog:   data.chatLog ?? [],
  };
  leads.unshift(newLead);
  writeToFile(leads);
  return newLead;
}

export async function deleteLead(id: string): Promise<void> {
  if (process.env.MONGODB_URI) {
    try {
      const { connectDB } = await import("@/lib/db");
      const { LeadModel } = await import("@/lib/models");
      await connectDB();
      await LeadModel.findByIdAndDelete(id);
      return;
    } catch (err) {
      console.error("[MongoDB] deleteLead failed:", err);
    }
  }
  writeToFile(readFromFile().filter((l) => l.id !== id));
}
