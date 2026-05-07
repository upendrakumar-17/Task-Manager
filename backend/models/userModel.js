const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  isVerified: { type: Boolean, default: false },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);