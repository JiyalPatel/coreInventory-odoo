const Location = require("../models/Location.model");
const Warehouse = require("../models/Warehouse.model");
const ApiError = require("../utils/ApiError");

const getAllLocations = async (warehouseFilter) => {
  const query = warehouseFilter ? { warehouse: warehouseFilter } : {};
  return Location.find(query).populate("warehouse", "name shortCode").sort({ createdAt: -1 });
};

const getLocationById = async (id) => {
  const location = await Location.findById(id).populate("warehouse", "name shortCode");
  if (!location) throw new ApiError(404, "Location not found");
  return location;
};

const createLocation = async ({ name, shortCode, warehouse: warehouseId }) => {
  const warehouse = await Warehouse.findById(warehouseId);
  if (!warehouse) throw new ApiError(404, "Warehouse not found");

  const fullCode = `${warehouse.shortCode}/${shortCode}`;

  return Location.create({ name, shortCode, warehouse: warehouseId, fullCode });
};

const updateLocation = async (id, { name, shortCode, warehouse: warehouseId }) => {
  let fullCode;

  if (warehouseId || shortCode) {
    const existing = await Location.findById(id).populate("warehouse");
    if (!existing) throw new ApiError(404, "Location not found");

    const warehouseShortCode = warehouseId
      ? (await Warehouse.findById(warehouseId))?.shortCode
      : existing.warehouse.shortCode;

    if (!warehouseShortCode) throw new ApiError(404, "Warehouse not found");
    fullCode = `${warehouseShortCode}/${shortCode || existing.shortCode}`;
  }

  const updateData = { name, shortCode, ...(warehouseId && { warehouse: warehouseId }), ...(fullCode && { fullCode }) };

  const location = await Location.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("warehouse", "name shortCode");

  if (!location) throw new ApiError(404, "Location not found");
  return location;
};

const deleteLocation = async (id) => {
  const location = await Location.findByIdAndDelete(id);
  if (!location) throw new ApiError(404, "Location not found");
  return location;
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
