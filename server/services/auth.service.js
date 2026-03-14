const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const { USER_STATUS } = require("../configs/constants");

const SALT_ROUNDS = 12;

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

module.exports = { signup, login, getMe, getPendingUsers, approveUser, rejectUser };
