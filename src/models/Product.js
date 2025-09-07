import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    microcategory: { type: String },
    price: { type: Number },
    sizePrices: [
      {
        size: { type: String },
        price: { type: Number },
      },
    ],
    longDescription: { type: String },
    benefits: [{ type: String }],
    features: [{ type: String }],
    keyIngredients: { type: String },
    shelfLife: { type: String },
    manufacturer: { type: String },
    countryOfOrigin: { type: String, default: "India" },
    expiryDate: { type: String },
    howToUse: { type: String },
    certifications: { type: String },
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],

    // Ayurveda-specific fields
    localName: { type: String },
    ayurvedicNames: [{ type: String }],
    shortIntro: { type: String },
    keySymptoms: [{ type: String }],
    ayurvedicCauses: [{ type: String }],
    treatmentPrinciples: [{ type: String }],
    effectiveHerbs: [{ type: String }],
    classicalFormulations: [{ type: String }],
    precautions: [{ type: String }],

    productType: {
      type: String,
      enum: ["product", "kit"],
      default: "product",
    },
    heroImageUrl: { type: String, required: true },
    productImageUrls: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Fix for Next.js hot-reload (avoid model overwrite error)
const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
