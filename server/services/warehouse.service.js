const Warehouse = require("../models/Warehouse.model");
const ApiError = require("../utils/ApiError");

const getAllWarehouses = async () => {
  return Warehouse.find().sort({ createdAt: -1 });
};

const getWarehouseById = async (id) => {
  const warehouse = await Warehouse.findById(id);
  if (!warehouse) throw new ApiError(404, "Warehouse not found");
  return warehouse;
};

const createWarehouse = async ({ name, shortCode, address }) => {
  return Warehouse.create({ name, shortCode: shortCode.toUpperCase(), address });
};

const updateWarehouse = async (id, { name, shortCode, address }) => {
  const warehouse = await Warehouse.findByIdAndUpdate(
    id,
    { name, shortCode: shortCode?.toUpperCase(), address },
    { new: true, runValidators: true }
  );
  if (!warehouse) throw new ApiError(404, "Warehouse not found");
  return warehouse;
};

const deleteWarehouse = async (id) => {
  const warehouse = await Warehouse.findByIdAndDelete(id);
  if (!warehouse) throw new ApiError(404, "Warehouse not found");
  return warehouse;
};

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
