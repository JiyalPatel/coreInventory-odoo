const Operation = require("../models/Operation.model");
const OperationLine = require("../models/OperationLine.model");
const Product = require("../models/Product.model");
const MoveHistory = require("../models/MoveHistory.model");
const Warehouse = require("../models/Warehouse.model");
const Location = require("../models/Location.model");
const ApiError = require("../utils/ApiError");
const { generateReference } = require("../utils/referenceGenerator");
const { OPERATION_STATUS, OPERATION_TYPES } = require("../configs/constants");

const populateOperation = (query) =>
  query
    .populate("responsible", "loginId email")
    .populate("warehouse", "name shortCode");

const populateLines = (lines) =>
  OperationLine.populate(lines, {
    path: "product",
    select: "name skuCode unitCost onHand",
  });

/**
 * Create a warehouse transfer.
 * This creates two linked operations:
 *   - An OUT from the source warehouse
 *   - An IN  to the destination warehouse
 * Both are created in DRAFT status. The user validates them separately.
 *
 * The OUT reference is stored on the IN as a note via contact field:
 *   contact = "Transfer from <sourceWarehouse.name> — by <loginId>"
 */
const createTransfer = async (
  { fromWarehouse, toWarehouse, scheduleDate, lines },
  userId,
  userLoginId
) => {
  if (fromWarehouse === toWarehouse) {
    throw new ApiError(400, "Source and destination warehouse must be different");
  }

  const srcWarehouse = await Warehouse.findById(fromWarehouse);
  if (!srcWarehouse) throw new ApiError(404, "Source warehouse not found");

  const dstWarehouse = await Warehouse.findById(toWarehouse);
  if (!dstWarehouse) throw new ApiError(404, "Destination warehouse not found");

  if (!lines || lines.length === 0) {
    throw new ApiError(400, "At least one product line is required");
  }

  // Validate products exist and check stock for OUT
  for (const line of lines) {
    const product = await Product.findById(line.product);
    if (!product) throw new ApiError(404, `Product ${line.product} not found`);
    if (product.onHand < line.quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for "${product.name}". Available: ${product.onHand}, Required: ${line.quantity}`
      );
    }
  }

  const contact = `Transfer by ${userLoginId}`;

  // Create OUT operation (source warehouse)
  const outReference = await generateReference(srcWarehouse.shortCode, "OUT");
  const outOperation = await Operation.create({
    reference: outReference,
    type: OPERATION_TYPES.OUT,
    contact,
    scheduleDate,
    warehouse: fromWarehouse,
    deliveryAddress: `Transfer to ${dstWarehouse.name}`,
    status: OPERATION_STATUS.DRAFT,
    responsible: userId,
  });

  await OperationLine.insertMany(
    lines.map((l) => ({
      operation: outOperation._id,
      product: l.product,
      quantity: l.quantity,
      isShort: false,
    }))
  );

  // Create IN operation (destination warehouse)
  const inReference = await generateReference(dstWarehouse.shortCode, "IN");
  const inOperation = await Operation.create({
    reference: inReference,
    type: OPERATION_TYPES.IN,
    contact,
    scheduleDate,
    warehouse: toWarehouse,
    deliveryAddress: "",
    status: OPERATION_STATUS.DRAFT,
    responsible: userId,
  });

  await OperationLine.insertMany(
    lines.map((l) => ({
      operation: inOperation._id,
      product: l.product,
      quantity: l.quantity,
      isShort: false,
    }))
  );

  // Return both operations populated
  const populatedOut = await populateOperation(Operation.findById(outOperation._id));
  const populatedIn  = await populateOperation(Operation.findById(inOperation._id));
  const outLines = await populateLines(await OperationLine.find({ operation: outOperation._id }));
  const inLines  = await populateLines(await OperationLine.find({ operation: inOperation._id }));

  return {
    outOperation: { operation: populatedOut, lines: outLines },
    inOperation:  { operation: populatedIn,  lines: inLines  },
  };
};

/**
 * List all transfer operations (operations whose contact starts with "Transfer by").
 * Returns pairs grouped by their linked reference pattern.
 */
const getTransfers = async ({ search } = {}) => {
  const filter = {
    contact: { $regex: "^Transfer by", $options: "i" },
  };

  if (search) {
    filter.$or = [
      { reference: { $regex: search, $options: "i" } },
      { contact:   { $regex: search, $options: "i" } },
    ];
  }

  const operations = await populateOperation(
    Operation.find(filter).sort({ createdAt: -1 })
  );
  return operations;
};

module.exports = { createTransfer, getTransfers };
