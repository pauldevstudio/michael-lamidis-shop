import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    message: { type: String, required: true },
    productSlug: { type: String, index: true },
  },
  { timestamps: true }
);

export type LeadDoc = InferSchemaType<typeof LeadSchema> & { _id: string };

export const LeadModel: Model<LeadDoc> =
  (models.Lead as Model<LeadDoc>) || model<LeadDoc>("Lead", LeadSchema);
