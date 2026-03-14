const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const formatValidationErrors = (errors) =>
  errors.array().map((e) => ({ field: e.path, message: e.msg }));

const signup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", formatValidationErrors(errors));
  }

  const { loginId, email, password } = req.body;
  await authService.signup({ loginId, email, password });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        null,
        "Registration successful. Your account is pending admin approval."
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, "Validation failed", formatValidationErrors(errors));
  }

  const { loginId, password } = req.body;
  const { token, user } = await authService.login({ loginId, password });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: Number(process.env.COOKIE_MAX_AGE_MS),
  });

  return res.status(200).json(new ApiResponse(200, { user }, "Login successful"));
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.userId);
  return res.status(200).json(new ApiResponse(200, { user }));
});

const getPendingUsers = asyncHandler(async (req, res) => {
  const users = await authService.getPendingUsers();
  return res.status(200).json(new ApiResponse(200, { users }));
});

const approveUser = asyncHandler(async (req, res) => {
  await authService.approveUser(req.params.userId);
  return res.status(200).json(new ApiResponse(200, null, "User approved successfully"));
});

const rejectUser = asyncHandler(async (req, res) => {
  await authService.rejectUser(req.params.userId);
  return res.status(200).json(new ApiResponse(200, null, "User rejected"));
});

module.exports = { signup, login, logout, getMe, getPendingUsers, approveUser, rejectUser };
