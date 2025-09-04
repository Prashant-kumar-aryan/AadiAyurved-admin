const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    warehouse: { type: String, default: "Main" },

    sizes: [
      {
        size: { type: String, required: true }, // e.g. "50g", "100g"
        quantity: { type: Number, default: 0 }, // stock count
      },
    ],

    lastRestocked: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Inventory ||
  mongoose.model("Inventory", inventorySchema);
