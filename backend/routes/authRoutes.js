const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Auth with Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_BASE_URL.replace(/\/$/, "")}/login`, session: false }),
  (req, res) => {
    // Successful authentication
    // Generate JWT
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const userData = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    };

    // Redirect to frontend with token and user data in query params
    // The frontend will parse these and save to localStorage
    const redirectUrl = `${process.env.FRONTEND_BASE_URL.replace(/\/$/, "")}/login?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}&oauth=true`;
    res.redirect(redirectUrl);
  }
);

module.exports = router;
