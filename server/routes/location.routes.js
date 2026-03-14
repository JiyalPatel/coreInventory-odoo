const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const locationController = require("../controllers/location.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const locationValidations = [
  body("name").trim().notEmpty().withMessage("Location name is required"),
  body("shortCode").trim().notEmpty().withMessage("Short code is required"),
  body("warehouse")
    .notEmpty().withMessage("Warehouse is required")
    .isMongoId().withMessage("Invalid warehouse ID"),
];

router.use(authMiddleware);

router.get("/", locationController.getAllLocations);
router.post("/", locationValidations, locationController.createLocation);
router.get("/:id", locationController.getLocationById);
router.put("/:id", locationValidations, locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);

module.exports = router;
