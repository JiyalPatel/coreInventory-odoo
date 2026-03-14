const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const warehouseController = require("../controllers/warehouse.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const warehouseValidations = [
  body("name").trim().notEmpty().withMessage("Warehouse name is required"),
  body("shortCode")
    .trim()
    .notEmpty().withMessage("Short code is required")
    .isLength({ min: 2, max: 5 }).withMessage("Short code must be 2–5 characters"),
];

router.use(authMiddleware);

router.get("/", warehouseController.getAllWarehouses);
router.post("/", warehouseValidations, warehouseController.createWarehouse);
router.get("/:id", warehouseController.getWarehouseById);
router.put("/:id", warehouseValidations, warehouseController.updateWarehouse);
router.delete("/:id", warehouseController.deleteWarehouse);

module.exports = router;
