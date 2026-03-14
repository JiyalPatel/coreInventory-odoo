const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const productValidations = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("skuCode").trim().notEmpty().withMessage("SKU code is required"),
  body("unitCost")
    .notEmpty().withMessage("Unit cost is required")
    .isFloat({ min: 0 }).withMessage("Unit cost must be a non-negative number"),
];

router.use(authMiddleware);

router.get("/", productController.getAllProducts);
router.post("/", productValidations, productController.createProduct);
router.get("/:id", productController.getProductById);
router.put("/:id", productValidations, productController.updateProduct);
router.patch("/:id/stock", productController.adjustStock);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
