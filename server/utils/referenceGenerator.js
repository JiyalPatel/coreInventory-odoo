const mongoose = require("mongoose");

// Counter schema to track sequences per operation type
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

/**
 * Generates a unique operation reference atomically.
 * @param {string} warehouseShortCode - e.g. "WH"
 * @param {string} type - "IN" or "OUT"
 * @returns {Promise<string>} - e.g. "WH/IN/0001"
 */
const generateReference = async (warehouseShortCode, type) => {
  const counterId = `${warehouseShortCode}-${type}`;

  const counter = await Counter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );

  const padded = counter.seq.toString().padStart(4, "0");
  return `${warehouseShortCode}/${type}/${padded}`;
};

module.exports = { generateReference };
