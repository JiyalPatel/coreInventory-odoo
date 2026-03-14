const { validationResult } = require("express-validator");
const transferService = require("../services/transfer.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const formatValidationErrors = (errors) =>
  errors.array().map((e) => ({ field: e.path, message: e.msg }));

const createTransfer = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", formatValidationErrors(errors));
  }

  const { fromWarehouse, toWarehouse, scheduleDate, lines } = req.body;
  const result = await transferService.createTransfer(
    { fromWarehouse, toWarehouse, scheduleDate, lines },
    req.user.userId,
    req.user.loginId
  );

  return res.status(201).json(new ApiResponse(201, result, "Transfer created"));
});

const getTransfers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const operations = await transferService.getTransfers({ search });
  return res.status(200).json(new ApiResponse(200, { operations }));
});

module.exports = { createTransfer, getTransfers };
