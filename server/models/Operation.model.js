const mongoose = require("mongoose");
const { OPERATION_TYPES, OPERATION_STATUS } = require("../configs/constants");

const operationSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(OPERATION_TYPES),
      required: [true, "Operation type is required"],
    },
    contact: {
      type: String,
      required: [true, "Contact is required"],
      trim: true,
    },
    scheduleDate: {
      type: Date,
      required: [true, "Schedule date is required"],
    },
    status: {
      type: String,
      enum: Object.values(OPERATION_STATUS),
      default: OPERATION_STATUS.DRAFT,
    },
    responsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Responsible user is required"],
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      required: [true, "Warehouse is required"],
    },
    deliveryAddress: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Operation", operationSchema);
