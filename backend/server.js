const express = require('express');
const env = require('dotenv');

env.config();
const app = express();

app.get('/', (req, res) => {
  res.send('Backend is live.');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});