const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const authorization = require("../middleware/authorization");
const generateToken = require("../services/generateToken");
const sendEmail = require("../services/sendEmail");
const _ = require("lodash");
const {
  signUpValidations,
  validateSignup,
} = require("../middleware/signUpMiddleware");
const db = require("../database/database");

router.post(
  "/api/signup",
  [...signUpValidations, validateSignup],
  async (req, res) => {
    const { username, email, password } = req.body;
    const role = email == process.env.EMAIL_USER ? "Admin" : "User";
    const emailCheckQuery =
      "SELECT * FROM User Where email = ? OR username = ?";
    const insertQuery = "INSERT INTO User VALUES(DEFAULT,?,?,?,?)";

    const connection = await db.getConnection();
    await connection.query("USE TASK_MANAGEMENT");
    const [users] = await connection.query(emailCheckQuery, [email, username]);
    if (users.length > 0) {
      return res
        .status(400)
        .send({ error: "User with this email or username already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const result = await connection.query(insertQuery, [
      username,
      email,
      hashedPassword,
      role,
    ]);
    sendEmail(email);
    connection.release();
    res.status(200).send(result);
  }
);

router.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM User WHERE email=?";
  const connection = await db.getConnection();
  await connection.query("USE TASK_MANAGEMENT");
  const [users] = await connection.query(query, [email]);
  if (users.length !== 1) {
    return res.status(400).send("INVALID EMAIL OR PASSWORD");
  }
  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  connection.release();
  if (!isMatch) return res.status(404).send("INVALID EMAIL OR PASSWORD");
  else {
    const token = await generateToken(user.email);
    req.session.user = user;
    return res.status(200).header("auth-token", token).send("Login Successful");
  }
});

router.get("/api/profile", [auth], (req, res) => {
  const user = _.pick(req.session.user, ["username"]);
  return res.status(200).send(user);
});

router.post("/api/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(400).send("You are not logged in");
  }
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error Logging out");
    }
    return res.send("You have logged out!");
  });
});

router.get("/api/allusers", [authorization], async (req, res) => {
  const connection = await db.getConnection();
  await connection.query("USE TASK_MANAGEMENT");
  const query = "SELECT * FROM User";
  const [users] = await connection.query(query);
  if (users.length === 0) {
    return res.status(400).send({ message: "No User Found" });
  }
  connection.release();
  return res.status(200).send(users);
});
module.exports = router;
