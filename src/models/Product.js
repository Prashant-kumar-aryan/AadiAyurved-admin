import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },

    sizes: { type: [String], required: true },
    longDescription: { type: String, trim: true },
    benefits: { type: [String], required: true },
    features: { type: [String], required: true },

    keyIngredients: { type: String, trim: true },
    shelfLife: { type: String, trim: true },
    manufacturer: { type: String, trim: true },
    countryOfOrigin: { type: String, trim: true },
    expiryDate: { type: String, trim: true },
    howToUse: { type: String, trim: true },
    certifications: { type: String, trim: true },

    faqs: [faqSchema],

    // Images
    heroImageUrl: { type: String, required: true },
    productImageUrls: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
