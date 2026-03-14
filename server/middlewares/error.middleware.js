const ApiError = require("../utils/ApiError");

const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errors = [];

  // Custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Mongoose ValidationError
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }
  // MongoDB duplicate key
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = "Duplicate value";
    errors = [{ field, message: `${field} already exists` }];
  }
  // JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired, please log in again";
  }
  // Mongoose bad ObjectId
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
  });
};

module.exports = errorMiddleware;
