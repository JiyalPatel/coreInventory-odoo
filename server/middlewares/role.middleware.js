const ApiError = require("../utils/ApiError");
const { ROLES } = require("../configs/constants");

const roleMiddleware = (req, res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return next(new ApiError(403, "Access denied. Admins only."));
  }
  next();
};

module.exports = roleMiddleware;
