const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, minlength: 5, maxlength: 20 },
    categories: { type: [String], default: ["General"] },
    quantity: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

// unique per user (owner + name)
productSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
