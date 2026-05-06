const bcrypt = require("bcryptjs");

const USE_HASH = process.env.USE_HASH;

const hashPassword = async (password) => {
  if (!USE_HASH) return password; 

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (enteredPassword, storedPassword) => {
  if (!USE_HASH) return enteredPassword === storedPassword;

  return await bcrypt.compare(enteredPassword, storedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
};