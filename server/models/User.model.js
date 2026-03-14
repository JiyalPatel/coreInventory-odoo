const mongoose = require("mongoose");
const { ROLES, USER_STATUS } = require("../configs/constants");

const userSchema = new mongoose.Schema(
  {
    loginId: {
      type: String,
      required: [true, "Login ID is required"],
      unique: true,
      minlength: [6, "Login ID must be at least 6 characters"],
      maxlength: [12, "Login ID must be at most 12 characters"],
      match: [/^[a-zA-Z0-9]+$/, "Login ID must be alphanumeric"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
