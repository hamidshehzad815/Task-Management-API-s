const jwt = require("jsonwebtoken");
module.exports = async function (email) {
  const payload = {
    email,
  };
  const secretKey = process.env.SECRET_KEY;
  const options = {
    expiresIn: "48h",
  };

  return jwt.sign(payload, secretKey, options);
};
