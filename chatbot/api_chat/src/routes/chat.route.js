
const express = require("express");
const router = express.Router();

const chatController = require("../controllers/chat.controller");
const { authenticate } = require("../auth/auth.middleware");

// POST /api/chat (đã bảo vệ bằng authenticate)
router.post("/chat", authenticate, chatController.chat);

module.exports = router;
