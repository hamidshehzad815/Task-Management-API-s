module.exports = function (req, res, next) {
  if (req.session.user.role !== "Admin") {
    return res.status(401).send({ message: "Cannot access to endpoint" });
  }
  next();
};
