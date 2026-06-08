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

/* ─── Orders ───────────────────────────────────────────────────── */

const OrderItemSchema = new Schema(
  {
    productId: String,
    brand:     String,
    model:     String,
    salePrice: Number,
    quantity:  Number,
  },
  { _id: false }
);

const OrderCustomerSchema = new Schema(
  {
    fullName:   String,
    email:      String,
    phone:      String,
    address:    String,
    city:       String,
    postalCode: String,
    notes:      String,
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    customer:   { type: OrderCustomerSchema, required: true },
    items:      { type: [OrderItemSchema], default: [] },
    totalPrice: { type: Number, required: true },
    payment:    {
      type: String,
      enum: ["bank_transfer", "cash_on_delivery", "showroom_pickup"],
      required: true,
    },
    status: { type: String, default: "new" },
  },
  { timestamps: true }
);

export interface OrderDoc {
  _id: string;
  customer: {
    fullName: string; email: string; phone: string;
    address?: string; city?: string; postalCode?: string; notes?: string;
  };
  items: Array<{
    productId: string; brand: string; model: string;
    salePrice: number; quantity: number;
  }>;
  totalPrice: number;
  payment: "bank_transfer" | "cash_on_delivery" | "showroom_pickup";
  status: string;
  createdAt: Date;
}

export const OrderModel: Model<OrderDoc> =
  (models.Order as Model<OrderDoc>) || model<OrderDoc>("Order", OrderSchema);

/* ─── Analytics events (first-party, real-time) ─────────────────── */

const AnalyticsEventSchema = new Schema(
  {
    ts:       { type: Date, default: Date.now, index: true },
    vid:      { type: String, index: true }, // anonymous visitor id (cookie)
    sid:      { type: String, index: true }, // session id (cookie, ~30 min)
    kind:     { type: String, enum: ["pageview", "event"], required: true },
    name:     { type: String, default: "" },  // event name (phone_click, cta_click, …)
    path:     { type: String, default: "" },
    referrer: { type: String, default: "" },
    source:   { type: String, default: "Direct" }, // classified channel
    device:   { type: String, default: "Desktop" }, // Desktop | Mobile | Tablet
    country:  { type: String, default: "" },
    city:     { type: String, default: "" },
    region:   { type: String, default: "" },
    label:    { type: String, default: "" },  // CTA/button/link label
    isNew:    { type: Boolean, default: false }, // first time we ever saw this vid
  },
  { timestamps: false }
);

export interface AnalyticsEventDoc {
  _id: string;
  ts: Date;
  vid: string;
  sid: string;
  kind: "pageview" | "event";
  name: string;
  path: string;
  referrer: string;
  source: string;
  device: string;
  country: string;
  city: string;
  region: string;
  label: string;
  isNew: boolean;
}

export const AnalyticsEventModel: Model<AnalyticsEventDoc> =
  (models.AnalyticsEvent as Model<AnalyticsEventDoc>) ||
  model<AnalyticsEventDoc>("AnalyticsEvent", AnalyticsEventSchema);
