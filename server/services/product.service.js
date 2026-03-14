const Product = require("../models/Product.model");
const OperationLine = require("../models/OperationLine.model");
const ApiError = require("../utils/ApiError");
const { OPERATION_STATUS } = require("../configs/constants");

// Active OUT operations that are not done/cancelled — these reserve stock
const ACTIVE_OUT_STATUSES = [
  OPERATION_STATUS.DRAFT,
  OPERATION_STATUS.READY,
  OPERATION_STATUS.WAITING,
];

/**
 * Compute freeToUse for an array of products.
 * freeToUse = onHand - quantity reserved in active OUT operation lines
 */
const attachFreeToUse = async (products) => {
  const Operation = require("../models/Operation.model");

  // Get all active OUT operation IDs
  const activeOutOps = await Operation.find({
    type: "OUT",
    status: { $in: ACTIVE_OUT_STATUSES },
  }).select("_id");

  const activeOutIds = activeOutOps.map((op) => op._id);

  // Get all lines for those operations
  const lines = await OperationLine.find({
    operation: { $in: activeOutIds },
  });

  // Build a map: productId -> total reserved quantity
  const reservedMap = {};
  for (const line of lines) {
    const key = line.product.toString();
    reservedMap[key] = (reservedMap[key] || 0) + line.quantity;
  }

  return products.map((p) => {
    const obj = p.toObject ? p.toObject() : { ...p };
    const reserved = reservedMap[obj._id.toString()] || 0;
    obj.freeToUse = Math.max(0, obj.onHand - reserved);
    return obj;
  });
};

const getAllProducts = async () => {
  const products = await Product.find().sort({ createdAt: -1 });
  return attachFreeToUse(products);
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");
  const [enriched] = await attachFreeToUse([product]);
  return enriched;
};

const createProduct = async ({ name, skuCode, unitCost }) => {
  return Product.create({ name, skuCode: skuCode.toUpperCase(), unitCost });
};

const updateProduct = async (id, { name, skuCode, unitCost }) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { name, ...(skuCode && { skuCode: skuCode.toUpperCase() }), unitCost },
    { new: true, runValidators: true }
  );
  if (!product) throw new ApiError(404, "Product not found");
  const [enriched] = await attachFreeToUse([product]);
  return enriched;
};

const adjustStock = async (id, { onHand }) => {
  if (onHand === undefined || onHand === null || onHand < 0) {
    throw new ApiError(400, "Valid onHand quantity (>= 0) is required");
  }
  const product = await Product.findByIdAndUpdate(
    id,
    { onHand },
    { new: true, runValidators: true }
  );
  if (!product) throw new ApiError(404, "Product not found");
  const [enriched] = await attachFreeToUse([product]);
  return enriched;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
};
