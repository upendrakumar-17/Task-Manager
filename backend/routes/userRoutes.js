const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  searchUsers
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/search", authMiddleware, searchUsers);

module.exports = router;