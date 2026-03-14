const { validationResult } = require("express-validator");
const warehouseService = require("../services/warehouse.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const formatValidationErrors = (errors) =>
  errors.array().map((e) => ({ field: e.path, message: e.msg }));

const getAllWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await warehouseService.getAllWarehouses();
  return res.status(200).json(new ApiResponse(200, { warehouses }));
});

const getWarehouseById = asyncHandler(async (req, res) => {
  const warehouse = await warehouseService.getWarehouseById(req.params.id);
  return res.status(200).json(new ApiResponse(200, { warehouse }));
});

const createWarehouse = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", formatValidationErrors(errors));
  }
  const { name, shortCode, address } = req.body;
  const warehouse = await warehouseService.createWarehouse({ name, shortCode, address });
  return res.status(201).json(new ApiResponse(201, { warehouse }, "Warehouse created"));
});

const updateWarehouse = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", formatValidationErrors(errors));
  }
  const { name, shortCode, address } = req.body;
  const warehouse = await warehouseService.updateWarehouse(req.params.id, { name, shortCode, address });
  return res.status(200).json(new ApiResponse(200, { warehouse }, "Warehouse updated"));
});

const deleteWarehouse = asyncHandler(async (req, res) => {
  await warehouseService.deleteWarehouse(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Warehouse deleted"));
});

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
