const { validationResult } = require("express-validator");
const operationService = require("../services/operation.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const formatValidationErrors = (errors) =>
  errors.array().map((e) => ({ field: e.path, message: e.msg }));

const getAllOperations = asyncHandler(async (req, res) => {
  const { type, status, search } = req.query;
  const operations = await operationService.getAllOperations({ type, status, search });
  return res.status(200).json(new ApiResponse(200, { operations }));
});

const getOperationById = asyncHandler(async (req, res) => {
  const { operation, lines } = await operationService.getOperationById(req.params.id);
  return res.status(200).json(new ApiResponse(200, { operation, lines }));
});

const createOperation = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", formatValidationErrors(errors));
  }
  const { type, contact, scheduleDate, warehouse, deliveryAddress, lines } = req.body;
  const result = await operationService.createOperation(
    { type, contact, scheduleDate, warehouse, deliveryAddress, lines },
    req.user.userId
  );
  return res.status(201).json(new ApiResponse(201, result, "Operation created"));
});

const updateOperation = asyncHandler(async (req, res) => {
  const { contact, scheduleDate, deliveryAddress, lines } = req.body;
  const result = await operationService.updateOperation(req.params.id, {
    contact,
    scheduleDate,
    deliveryAddress,
    lines,
  });
  return res.status(200).json(new ApiResponse(200, result, "Operation updated"));
});

const markTodo = asyncHandler(async (req, res) => {
  const result = await operationService.markTodo(req.params.id);
  return res.status(200).json(new ApiResponse(200, result, "Operation marked as ready"));
});

const validateOperation = asyncHandler(async (req, res) => {
  const result = await operationService.validateOperation(req.params.id);
  return res.status(200).json(new ApiResponse(200, result, "Operation validated and done"));
});

const cancelOperation = asyncHandler(async (req, res) => {
  const operation = await operationService.cancelOperation(req.params.id);
  return res.status(200).json(new ApiResponse(200, { operation }, "Operation cancelled"));
});

module.exports = {
  getAllOperations,
  getOperationById,
  createOperation,
  updateOperation,
  markTodo,
  validateOperation,
  cancelOperation,
};
