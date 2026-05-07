const express = require('express');
const env = require('dotenv');
const mongoose = require("mongoose");
const connectDB = require("./config/database");

env.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

connectDB();

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);


app.get('/', (req, res) => {
  res.send('Backend is live.');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});