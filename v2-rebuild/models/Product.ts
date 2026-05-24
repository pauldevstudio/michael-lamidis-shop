import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

const ImageSchema = new Schema(
  { url: { type: String, required: true }, alt: { type: String } },
  { _id: false }
);

const SpecSchema = new Schema(
  { label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    brand: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    currency: { type: String, default: "EUR" },
    condition: {
      type: String,
      enum: ["new", "open-box", "refurbished"],
      default: "open-box",
    },
    images: { type: [ImageSchema], default: [] },
    specs: { type: [SpecSchema], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export type ProductDoc = InferSchemaType<typeof ProductSchema> & { _id: string };

export const ProductModel: Model<ProductDoc> =
  (models.Product as Model<ProductDoc>) || model<ProductDoc>("Product", ProductSchema);
