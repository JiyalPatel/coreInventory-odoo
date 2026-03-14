const dashboardService = require("../services/dashboard.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  return res.status(200).json(new ApiResponse(200, stats));
});

module.exports = { getDashboard };
