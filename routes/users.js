const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const authorization = require("../middleware/authorization");
const generateToken = require("../services/generateToken");
const { registraionEmail: sendEmail } = require("../services/sendEmail");
const _ = require("lodash");
const {
  signUpValidations,
  validateSignup,
} = require("../middleware/signUpMiddleware");
const {
  loginValidations,
  validateLogin,
} = require("../middleware/loginMiddleware");
const db = require("../database/database");

router.post(
  "/signup",
  [...signUpValidations, validateSignup],
  async (req, res) => {
    const { username, email, password } = req.body;
    const role = email == process.env.EMAIL_USER ? "admin" : "user";
    const emailCheckQuery =
      "SELECT * FROM User Where email = ? OR username = ?";
    const insertQuery = "INSERT INTO User VALUES(DEFAULT,?,?,?,?)";

    const connection = await db.getConnection();
    const [users] = await connection.query(emailCheckQuery, [email, username]);
    if (users.length > 0) {
      return res
        .status(400)
        .send({ error: "User with this email or username already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await connection.query(insertQuery, [
      username,
      email,
      hashedPassword,
      role,
    ]);
    sendEmail(email);
    connection.release();
    res.status(200).send({ message: "Confirmation Email sent" });
  }
);

router.post(
  "/login",
  [...loginValidations, validateLogin],
  async (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM User WHERE email=?";
    const connection = await db.getConnection();
    const [users] = await connection.query(query, [email]);
    if (users.length !== 1) {
      return res.status(401).send({ message: "INVALID EMAIL OR PASSWORD" });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    connection.release();
    if (!isMatch)
      return res.status(401).send({ message: "INVALID EMAIL OR PASSWORD" });
    else {
      const token = await generateToken(_.omit(user, ["password"]));
      return res.status(200).json({ token });
    }
  }
);

router.get("/profile", [auth], (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
});

router.post("/logout", (req, res) => {
  return res.json({ message: "You have logged out!" });
});

router.get("/allusers", [auth, authorization], async (req, res) => {
  const connection = await db.getConnection();
  const query = "SELECT * FROM User";
  const [users] = await connection.query(query);
  if (users.length === 0) {
    return res.status(404).send({ message: "No User Found" });
  }
  connection.release();
  return res.status(200).send(users);
});

router.delete(
  "/delete-user/:userId",
  [auth, authorization],
  async (req, res) => {
    const userId = req.params.userId;
    if (!userId) return res.status(404).send({ message: "UserId missing" });
    const connection = await db.getConnection();
    const query = "DELETE FROM User WHERE userId = ?";
    const result = await connection.query(query, [userId]);
    if (result[0].affectedRows === 0) {
      return res.status(404).send({ message: "Invalid userId" });
    }
    connection.release();
    return res.status(200).send({ message: "User deleted" });
  }
);
module.exports = router;
