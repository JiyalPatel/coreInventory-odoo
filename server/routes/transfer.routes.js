const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const transferController = require("../controllers/transfer.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const transferValidations = [
  body("fromWarehouse")
    .notEmpty().withMessage("Source warehouse is required")
    .isMongoId().withMessage("Invalid source warehouse ID"),
  body("toWarehouse")
    .notEmpty().withMessage("Destination warehouse is required")
    .isMongoId().withMessage("Invalid destination warehouse ID"),
  body("scheduleDate")
    .notEmpty().withMessage("Schedule date is required")
    .isISO8601().withMessage("Schedule date must be a valid date"),
  body("lines")
    .isArray({ min: 1 }).withMessage("At least one product line is required"),
  body("lines.*.product")
    .notEmpty().withMessage("Product is required for each line")
    .isMongoId().withMessage("Invalid product ID in line"),
  body("lines.*.quantity")
    .notEmpty().withMessage("Quantity is required for each line")
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

router.use(authMiddleware);

router.get("/", transferController.getTransfers);
router.post("/", transferValidations, transferController.createTransfer);

module.exports = router;
