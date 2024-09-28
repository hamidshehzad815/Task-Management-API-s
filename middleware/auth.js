const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  if (!req.session.user) {
    return res.status(401).send({ message: "You are not logged in" });
  }

  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ message: "Access Denied" });
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = req.session.user;
    req.user.verified = verified;
    next();
  } catch (err) {
    return res.status(400).send({ message: "Invalid Token" });
  }
};
