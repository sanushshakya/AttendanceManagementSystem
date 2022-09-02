const jwt = require("jsonwebtoken");
const vars = require("../configs/vars.configs");

const SECRET = vars.secret;

const generateTokenAsync = async (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, { expiresIn: 60 * 60 }, (err, encoded) => {
      if (err) reject(err);
      else resolve(encoded);
    });
  });

// const generateToken = (payload) => {
//     return jwt.sign(payload, SECRET, { expiresIn: '6h'});
// }

const validateToken = async (token) => {
  try {
    return { data: jwt.verify(token, SECRET) };
  } catch (error) {
    return { error: "invalid token" };
  }
};

module.exports = {
  generateTokenAsync,
  validateToken,
};
