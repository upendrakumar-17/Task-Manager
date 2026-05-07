const express = require('express');
const env = require('dotenv');
const cors = require("cors");

env.config();
// const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/database");

env.config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: `${process.env.FRONTEND_BASE_URL}`,
    credentials: true,
  })
);

app.use(express.json());

connectDB();

const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const otpRoutes = require("./routes/otpRoutes");
const authRoutes = require("./routes/authRoutes");
const passport = require("passport");

// Passport Config
require("./config/passport");
app.use(passport.initialize());

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);


app.get('/', (req, res) => {
  res.send('Backend is live.');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});