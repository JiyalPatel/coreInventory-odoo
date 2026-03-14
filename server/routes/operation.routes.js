const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const operationController = require("../controllers/operation.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const operationValidations = [
  body("type")
    .notEmpty().withMessage("Operation type is required")
    .isIn(["IN", "OUT"]).withMessage("Type must be IN or OUT"),
  body("contact").trim().notEmpty().withMessage("Contact is required"),
  body("scheduleDate")
    .notEmpty().withMessage("Schedule date is required")
    .isISO8601().withMessage("Schedule date must be a valid date"),
  body("warehouse")
    .notEmpty().withMessage("Warehouse is required")
    .isMongoId().withMessage("Invalid warehouse ID"),
  body("lines")
    .isArray({ min: 1 }).withMessage("At least one line item is required"),
  body("lines.*.product")
    .notEmpty().withMessage("Product is required for each line")
    .isMongoId().withMessage("Invalid product ID in line"),
  body("lines.*.quantity")
    .notEmpty().withMessage("Quantity is required for each line")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

router.use(authMiddleware);

router.get("/", operationController.getAllOperations);
router.post("/", operationValidations, operationController.createOperation);
router.get("/:id", operationController.getOperationById);
router.put("/:id", operationController.updateOperation);
router.patch("/:id/todo", operationController.markTodo);
router.patch("/:id/validate", operationController.validateOperation);
router.patch("/:id/cancel", operationController.cancelOperation);

module.exports = router;
