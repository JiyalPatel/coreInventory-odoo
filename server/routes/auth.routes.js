const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// ── Signup validations ────────────────────────────────────────────────────────
const signupValidations = [
  body("loginId")
    .trim()
    .notEmpty().withMessage("Login ID is required")
    .isLength({ min: 6, max: 12 }).withMessage("Login ID must be between 6 and 12 characters")
    .isAlphanumeric().withMessage("Login ID must be alphanumeric"),
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character"),
  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),
];

// ── Login validations ─────────────────────────────────────────────────────────
const loginValidations = [
  body("loginId").notEmpty().withMessage("Login ID is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// ── Forgot password validations ───────────────────────────────────────────────
const forgotPasswordValidations = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),
];

const verifyOtpValidations = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),
  body("otp")
    .trim()
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
    .isNumeric().withMessage("OTP must be numeric"),
];

const resetPasswordValidations = [
  body("resetToken").notEmpty().withMessage("Reset token is required"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character"),
  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),
];

// ── Public routes ─────────────────────────────────────────────────────────────
router.post("/signup", signupValidations, authController.signup);
router.post("/login", loginValidations, authController.login);
router.post("/forgot-password", forgotPasswordValidations, authController.forgotPassword);
router.post("/verify-otp", verifyOtpValidations, authController.verifyOtp);
router.post("/reset-password", resetPasswordValidations, authController.resetPassword);

// ── Protected routes ──────────────────────────────────────────────────────────
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.getMe);

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.get("/pending-users", authMiddleware, roleMiddleware, authController.getPendingUsers);
router.patch("/approve/:userId", authMiddleware, roleMiddleware, authController.approveUser);
router.patch("/reject/:userId", authMiddleware, roleMiddleware, authController.rejectUser);

module.exports = router;
