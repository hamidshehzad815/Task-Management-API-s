module.exports = function (req, res, next) {
  if (!req.session.user) {
    return res.status(401).send({ message: "You are not logged in" });
  }
  req.body.user = req.session.user;
  next();
};
