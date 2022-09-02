const bcrypt = require("bcryptjs");

const hashPasswordAsync = async (password) => {
  const salt = await bcrypt.genSaltSync(10);

  return await bcrypt.hashSync(password, salt);
};

const comparePasswordAsync = async (password, hash) =>
  bcrypt.compare(password, hash);

module.exports = {
  hashPasswordAsync,
  comparePasswordAsync,
};
