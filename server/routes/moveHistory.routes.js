const express = require("express");
const router = express.Router();
const moveHistoryController = require("../controllers/moveHistory.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", moveHistoryController.getAllMoveHistory);

module.exports = router;
