const Operation = require("../models/Operation.model");
const OperationLine = require("../models/OperationLine.model");
const Product = require("../models/Product.model");
const MoveHistory = require("../models/MoveHistory.model");
const Warehouse = require("../models/Warehouse.model");
const Location = require("../models/Location.model");
const ApiError = require("../utils/ApiError");
const { generateReference } = require("../utils/referenceGenerator");
const { OPERATION_STATUS, OPERATION_TYPES } = require("../configs/constants");

// ── Helpers ──────────────────────────────────────────────────────────────────

const populateOperation = (query) =>
  query
    .populate("responsible", "loginId email")
    .populate("warehouse", "name shortCode");

const populateLines = (lines) =>
  OperationLine.populate(lines, {
    path: "product",
    select: "name skuCode unitCost onHand",
  });

// ── Read ──────────────────────────────────────────────────────────────────────

const getAllOperations = async ({ type, status, search }) => {
  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { reference: { $regex: search, $options: "i" } },
      { contact: { $regex: search, $options: "i" } },
    ];
  }

  const operations = await populateOperation(
    Operation.find(filter).sort({ createdAt: -1 })
  );
  return operations;
};

const getOperationById = async (id) => {
  const operation = await populateOperation(Operation.findById(id));
  if (!operation) throw new ApiError(404, "Operation not found");

  const lines = await OperationLine.find({ operation: id });
  const populatedLines = await populateLines(lines);

  return { operation, lines: populatedLines };
};

// ── Create ────────────────────────────────────────────────────────────────────

const createOperation = async (
  { type, contact, scheduleDate, warehouse: warehouseId, deliveryAddress, lines },
  userId
) => {
  const warehouse = await Warehouse.findById(warehouseId);
  if (!warehouse) throw new ApiError(404, "Warehouse not found");

  if (!lines || lines.length === 0) {
    throw new ApiError(400, "At least one operation line is required");
  }

  // Validate all product IDs exist
  for (const line of lines) {
    const product = await Product.findById(line.product);
    if (!product) throw new ApiError(404, `Product ${line.product} not found`);
  }

  const reference = await generateReference(warehouse.shortCode, type);

  const operation = await Operation.create({
    reference,
    type,
    contact,
    scheduleDate,
    warehouse: warehouseId,
    deliveryAddress: deliveryAddress || "",
    status: OPERATION_STATUS.DRAFT,
    responsible: userId,
  });

  const operationLines = await OperationLine.insertMany(
    lines.map((l) => ({
      operation: operation._id,
      product: l.product,
      quantity: l.quantity,
      isShort: false,
    }))
  );

  const populatedOp = await populateOperation(Operation.findById(operation._id));
  const populatedLines = await populateLines(operationLines);

  return { operation: populatedOp, lines: populatedLines };
};

// ── Update (draft only) ───────────────────────────────────────────────────────

const updateOperation = async (id, { contact, scheduleDate, deliveryAddress, lines }) => {
  const operation = await Operation.findById(id);
  if (!operation) throw new ApiError(404, "Operation not found");

  if (
    operation.status === OPERATION_STATUS.DONE ||
    operation.status === OPERATION_STATUS.CANCELLED
  ) {
    throw new ApiError(400, "Cannot update a completed or cancelled operation");
  }

  if (operation.status !== OPERATION_STATUS.DRAFT) {
    throw new ApiError(400, "Only draft operations can be edited");
  }

  // Update operation fields
  if (contact !== undefined) operation.contact = contact;
  if (scheduleDate !== undefined) operation.scheduleDate = scheduleDate;
  if (deliveryAddress !== undefined) operation.deliveryAddress = deliveryAddress;
  await operation.save();

  // Replace lines if provided
  if (lines && lines.length > 0) {
    await OperationLine.deleteMany({ operation: id });
    await OperationLine.insertMany(
      lines.map((l) => ({
        operation: id,
        product: l.product,
        quantity: l.quantity,
        isShort: false,
      }))
    );
  }

  const populatedOp = await populateOperation(Operation.findById(id));
  const updatedLines = await OperationLine.find({ operation: id });
  const populatedLines = await populateLines(updatedLines);

  return { operation: populatedOp, lines: populatedLines };
};

// ── PATCH /todo — Draft → Ready (or Waiting for short-stock OUT) ──────────────

const markTodo = async (id) => {
  const operation = await Operation.findById(id);
  if (!operation) throw new ApiError(404, "Operation not found");

  if (operation.status !== OPERATION_STATUS.DRAFT) {
    throw new ApiError(400, "Only draft operations can be moved to ready");
  }

  const lines = await OperationLine.find({ operation: id }).populate("product");

  if (operation.type === OPERATION_TYPES.OUT) {
    let hasShort = false;

    for (const line of lines) {
      const product = line.product;
      if (product.onHand < line.quantity) {
        line.isShort = true;
        hasShort = true;
      } else {
        line.isShort = false;
      }
      await line.save();
    }

    operation.status = hasShort ? OPERATION_STATUS.WAITING : OPERATION_STATUS.READY;
  } else {
    // IN operation — no stock check needed
    operation.status = OPERATION_STATUS.READY;
  }

  await operation.save();

  const populatedOp = await populateOperation(Operation.findById(id));
  const populatedLines = await populateLines(lines);

  return { operation: populatedOp, lines: populatedLines };
};

// ── PATCH /validate — Ready → Done ───────────────────────────────────────────

const validateOperation = async (id) => {
  const operation = await Operation.findById(id);
  if (!operation) throw new ApiError(404, "Operation not found");

  if (operation.status !== OPERATION_STATUS.READY) {
    throw new ApiError(400, "Only ready operations can be validated");
  }

  const lines = await OperationLine.find({ operation: id }).populate("product");

  // For OUT: re-check stock before committing
  if (operation.type === OPERATION_TYPES.OUT) {
    for (const line of lines) {
      const fresh = await Product.findById(line.product._id);
      if (fresh.onHand < line.quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for product "${fresh.name}". Available: ${fresh.onHand}, Required: ${line.quantity}`
        );
      }
    }
  }

  // Resolve locations for move history
  // Use warehouse's first location or a fallback virtual location
  const warehouse = await Warehouse.findById(operation.warehouse);
  const warehouseLocations = await Location.find({ warehouse: operation.warehouse });

  // Use first available location; if none, we can't create MoveHistory with real locations
  // The spec says fromLocation/toLocation are required — use the warehouse's first location
  // For IN: from=virtual supplier → to=warehouse location
  // For OUT: from=warehouse location → to=virtual delivery
  // Since the spec doesn't define a "supplier" or "delivery" virtual location,
  // we use the same warehouse location for both sides when only one exists.
  // In production, you'd pick the exact bin. For now: use first available location.
  const warehouseLocation = warehouseLocations[0] || null;

  // Commit stock changes and create MoveHistory
  for (const line of lines) {
    const product = await Product.findById(line.product._id);

    if (operation.type === OPERATION_TYPES.IN) {
      product.onHand += line.quantity;
    } else {
      product.onHand -= line.quantity;
    }

    await product.save();

    // Create MoveHistory only when locations are available
    if (warehouseLocation) {
      await MoveHistory.create({
        operation: operation._id,
        product: line.product._id,
        fromLocation: warehouseLocation._id,
        toLocation: warehouseLocation._id,
        quantity: line.quantity,
        moveType: operation.type,
      });
    }
  }

  operation.status = OPERATION_STATUS.DONE;
  await operation.save();

  const populatedOp = await populateOperation(Operation.findById(id));
  const populatedLines = await populateLines(lines);

  return { operation: populatedOp, lines: populatedLines };
};

// ── PATCH /cancel ─────────────────────────────────────────────────────────────

const cancelOperation = async (id) => {
  const operation = await Operation.findById(id);
  if (!operation) throw new ApiError(404, "Operation not found");

  if (
    operation.status !== OPERATION_STATUS.DRAFT &&
    operation.status !== OPERATION_STATUS.READY
  ) {
    throw new ApiError(400, "Only draft or ready operations can be cancelled");
  }

  operation.status = OPERATION_STATUS.CANCELLED;
  await operation.save();

  return operation;
};

module.exports = {
  getAllOperations,
  getOperationById,
  createOperation,
  updateOperation,
  markTodo,
  validateOperation,
  cancelOperation,
};
