const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      loginId: decoded.loginId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    // Let global error middleware handle JWT errors
    next(error);
  }
};

module.exports = authMiddleware;
