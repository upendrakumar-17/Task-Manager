const express = require('express');
const env = require('dotenv');

env.config();
// const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/database");

env.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

connectDB();

const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);


app.get('/', (req, res) => {
  res.send('Backend is live.');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});