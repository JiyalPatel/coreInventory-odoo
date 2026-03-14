const { validationResult } = require("express-validator");
const locationService = require("../services/location.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const formatValidationErrors = (errors) =>
  errors.array().map((e) => ({ field: e.path, message: e.msg }));

const getAllLocations = asyncHandler(async (req, res) => {
  const locations = await locationService.getAllLocations(req.query.warehouse);
  return res.status(200).json(new ApiResponse(200, { locations }));
});

const getLocationById = asyncHandler(async (req, res) => {
  const location = await locationService.getLocationById(req.params.id);
  return res.status(200).json(new ApiResponse(200, { location }));
});

const createLocation = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", formatValidationErrors(errors));
  }
  const { name, shortCode, warehouse } = req.body;
  const location = await locationService.createLocation({ name, shortCode, warehouse });
  return res.status(201).json(new ApiResponse(201, { location }, "Location created"));
});

const updateLocation = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", formatValidationErrors(errors));
  }
  const { name, shortCode, warehouse } = req.body;
  const location = await locationService.updateLocation(req.params.id, { name, shortCode, warehouse });
  return res.status(200).json(new ApiResponse(200, { location }, "Location updated"));
});

const deleteLocation = asyncHandler(async (req, res) => {
  await locationService.deleteLocation(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Location deleted"));
});

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
