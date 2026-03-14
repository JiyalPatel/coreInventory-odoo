const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Warehouse name is required"],
      trim: true,
    },
    shortCode: {
      type: String,
      required: [true, "Short code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [2, "Short code must be at least 2 characters"],
      maxlength: [5, "Short code must be at most 5 characters"],
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warehouse", warehouseSchema);
