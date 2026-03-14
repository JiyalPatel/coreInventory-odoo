const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const { USER_STATUS } = require("../configs/constants");
const { sendOtpEmail } = require("./email.service");

const SALT_ROUNDS = 12;
const OTP_EXPIRY_MINUTES = 10;
const RESET_TOKEN_EXPIRY_MINUTES = 15;

const signup = async ({ loginId, email, password }) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    loginId,
    email,
    passwordHash,
    role: "user",
    status: USER_STATUS.PENDING,
  });

  return user;
};

const login = async ({ loginId, password }) => {
  const user = await User.findOne({ loginId }).select("+passwordHash");

  if (!user) {
    throw new ApiError(401, "Invalid login ID or password");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid login ID or password");
  }

  if (user.status === USER_STATUS.PENDING) {
    throw new ApiError(403, "Your account is awaiting admin approval.");
  }

  if (user.status === USER_STATUS.REJECTED) {
    throw new ApiError(
      403,
      "Your account has been rejected. Contact the administrator."
    );
  }

  const token = jwt.sign(
    { userId: user._id, loginId: user.loginId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      _id: user._id,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
    },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select("_id loginId email role");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const getPendingUsers = async () => {
  return User.find({ status: USER_STATUS.PENDING }).select(
    "_id loginId email createdAt"
  );
};

const approveUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status: USER_STATUS.APPROVED },
    { new: true }
  );
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const rejectUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { status: USER_STATUS.REJECTED },
    { new: true }
  );
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// ── Forgot Password ───────────────────────────────────────────────────────────

/**
 * Step 1: User submits their email.
 * Generate a 6-digit OTP, store its hash + expiry on the user, send via email.
 * Always returns success even if email not found (prevent user enumeration).
 */
const sendForgotPasswordOtp = async ({ email }) => {
  const user = await User.findOne({ email });

  // Silently return if user not found — don't leak whether email exists
  if (!user) return;

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash the OTP before storing (don't store plaintext)
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await User.findByIdAndUpdate(user._id, {
    passwordResetOtp: otpHash,
    passwordResetOtpExpiry: expiry,
    // Clear any previous reset token if they're re-requesting
    passwordResetToken: null,
    passwordResetTokenExpiry: null,
  });

  await sendOtpEmail({ to: user.email, otp });
};

/**
 * Step 2: User submits their email + the OTP they received.
 * Verify OTP — if valid, return a short-lived reset token they use in step 3.
 */
const verifyOtp = async ({ email, otp }) => {
  const user = await User.findOne({ email }).select(
    "+passwordResetOtp +passwordResetOtpExpiry"
  );

  if (!user || !user.passwordResetOtp || !user.passwordResetOtpExpiry) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (new Date() > user.passwordResetOtpExpiry) {
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  if (otpHash !== user.passwordResetOtp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // OTP is valid — generate a one-time reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

  // Clear OTP and store reset token
  await User.findByIdAndUpdate(user._id, {
    passwordResetOtp: null,
    passwordResetOtpExpiry: null,
    passwordResetToken: resetTokenHash,
    passwordResetTokenExpiry: resetTokenExpiry,
  });

  // Return the raw (unhashed) token to the client
  return { resetToken };
};

/**
 * Step 3: User submits the reset token + new password.
 * Validate token, hash new password, save.
 */
const resetPassword = async ({ resetToken, password }) => {
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetTokenExpiry: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetTokenExpiry");

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token. Please start over.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await User.findByIdAndUpdate(user._id, {
    passwordHash,
    passwordResetToken: null,
    passwordResetTokenExpiry: null,
  });
};

module.exports = {
  signup,
  login,
  getMe,
  getPendingUsers,
  approveUser,
  rejectUser,
  sendForgotPasswordOtp,
  verifyOtp,
  resetPassword,
};
