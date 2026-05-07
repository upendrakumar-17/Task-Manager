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
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
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
      token: token,
    };

    // Script to send message to opener window and close this popup/tab
    // This is useful if the frontend opens the auth in a popup
    // For now, we'll redirect with token in query param or better, a script that saves to localStorage
    const script = `
      <script>
        localStorage.setItem('token', '${token}');
        localStorage.setItem('user', '${JSON.stringify(userData)}');
        window.location.href = 'http://localhost:3000/dashboard';
      </script>
    `;
    res.send(script);
  }
);

module.exports = router;
