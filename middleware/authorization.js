const ADMIN_ROLE = "Admin";

module.exports = function (req, res, next) {
  const user = req?.user;

  if (!user) {
    console.warn("Unauthorized access attempt: User object not found.");
    return res.status(401).send({ message: "User not authenticated" });
  }

  if (user.role !== ADMIN_ROLE) {
    console.warn(
      `Unauthorized access attempt: User ${user.id} tried to access admin endpoint.`
    );
    return res
      .status(403)
      .send({ message: "Access to this endpoint is forbidden" });
  }

  next();
};
