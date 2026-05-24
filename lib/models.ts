/**
 * Mongoose models for the root project.
 * Kept in one file so Next.js hot-reload doesn't re-register them.
 */
import { Schema, model, models, type Model } from "mongoose";

/* ─── Site Content ─────────────────────────────────────────────── */

const SiteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "site" },
    // Store the entire content blob as a flexible Mixed type —
    // validation lives in lib/site-content.ts (mergeDefaults)
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SiteContentModel: Model<{ key: string; data: unknown }> =
  (models.SiteContent as Model<{ key: string; data: unknown }>) ||
  model("SiteContent", SiteContentSchema);

/* ─── Leads ────────────────────────────────────────────────────── */

const ChatMessageSchema = new Schema(
  { role: { type: String, enum: ["user", "assistant"] }, content: String },
  { _id: false }
);

const LeadSchema = new Schema(
  {
    name:      { type: String, default: "Unknown" },
    phone:     { type: String, default: "Unknown" },
    chatLog:   { type: [ChatMessageSchema], default: [] },
  },
  { timestamps: true }
);

export interface LeadDoc {
  _id: string;
  name: string;
  phone: string;
  chatLog: Array<{ role: string; content: string }>;
  createdAt: Date;
}

export const LeadModel: Model<LeadDoc> =
  (models.Lead as Model<LeadDoc>) || model<LeadDoc>("Lead", LeadSchema);
