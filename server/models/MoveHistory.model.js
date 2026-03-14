const mongoose = require("mongoose");
const { MOVE_TYPES } = require("../configs/constants");

const moveHistorySchema = new mongoose.Schema(
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
    fromLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "From location is required"],
    },
    toLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "To location is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    moveType: {
      type: String,
      enum: Object.values(MOVE_TYPES),
      required: [true, "Move type is required"],
    },
    movedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MoveHistory", moveHistorySchema);
