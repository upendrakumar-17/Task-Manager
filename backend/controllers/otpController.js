const OTP = require("../models/otpModel");
const sendEmail = require("../utils/sendEmail");

// Generate and Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB (overwrite if already exists for this email)
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Send via email
    const message = `Your OTP for Task Manager is: ${otp}. It will expire in 5 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #000;">Task Manager Verification</h2>
        <p>Your one-time password (OTP) is:</p>
        <div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px; border-radius: 5px;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 20px;">This code will expire in 5 minutes.</p>
      </div>
    `;

    try {
      await sendEmail({
        email,
        subject: "Your Task Manager Verification Code",
        message,
        html
      });
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).json({ message: "Failed to send email. Check SMTP settings." });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const record = await OTP.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found. Please resend." });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is correct, delete it from DB
    await OTP.deleteOne({ email });

    res.json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
