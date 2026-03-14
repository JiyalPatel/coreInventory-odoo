const express = require("express");
const router = express.Router();
const moveHistoryController = require("../controllers/moveHistory.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", moveHistoryController.getAllMoveHistory);
router.get("/product/:productId", moveHistoryController.getProductLedger);

module.exports = router;
