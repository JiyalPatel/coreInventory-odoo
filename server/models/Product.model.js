const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    skuCode: {
      type: String,
      required: [true, "SKU code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    unitCost: {
      type: Number,
      required: [true, "Unit cost is required"],
      min: [0, "Unit cost cannot be negative"],
    },
    onHand: {
      type: Number,
      default: 0,
      min: [0, "On-hand quantity cannot be negative"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
