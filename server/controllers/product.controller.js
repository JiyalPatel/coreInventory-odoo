const { validationResult } = require("express-validator");
const productService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const formatValidationErrors = (errors) =>
  errors.array().map((e) => ({ field: e.path, message: e.msg }));

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.getAllProducts();
  return res.status(200).json(new ApiResponse(200, { products }));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return res.status(200).json(new ApiResponse(200, { product }));
});

const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", formatValidationErrors(errors));
  }
  const { name, skuCode, unitCost } = req.body;
  const product = await productService.createProduct({ name, skuCode, unitCost });
  return res.status(201).json(new ApiResponse(201, { product }, "Product created"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", formatValidationErrors(errors));
  }
  const { name, skuCode, unitCost } = req.body;
  const product = await productService.updateProduct(req.params.id, { name, skuCode, unitCost });
  return res.status(200).json(new ApiResponse(200, { product }, "Product updated"));
});

const adjustStock = asyncHandler(async (req, res) => {
  const { onHand } = req.body;
  const product = await productService.adjustStock(req.params.id, { onHand });
  return res.status(200).json(new ApiResponse(200, { product }, "Stock updated"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Product deleted"));
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustStock,
  deleteProduct,
};
