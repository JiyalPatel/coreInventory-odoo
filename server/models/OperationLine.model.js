const mongoose = require("mongoose");

const operationLineSchema = new mongoose.Schema(
  {
    operation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operation",
      required: [true, "Operation is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    isShort: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OperationLine", operationLineSchema);
