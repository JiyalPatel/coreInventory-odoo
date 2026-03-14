const moveHistoryService = require("../services/moveHistory.service");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getAllMoveHistory = asyncHandler(async (req, res) => {
  const { search, type } = req.query;
  const history = await moveHistoryService.getAllMoveHistory({ search, type });
  return res.status(200).json(new ApiResponse(200, { history }));
});

module.exports = { getAllMoveHistory };
