const express = require("express");
const router = express.Router();
const db = require("../database/database");
const auth = require("../middleware/auth");

router.post("/createComment", [auth], async (req, res) => {
  const { taskId, commentBody } = req.body;
  if (!taskId || !commentBody)
    return res
      .status(400)
      .send({
        message: "field missing(taskId and commentBody both are required",
      });
  const user = req.user;
  const connection = await db.getConnection();
  const query = "INSERT INTO Comment VALUES(DEFAULT,?,?,?,DEFAULT)";
  const result = await connection.query(query, [
    taskId,
    user.userId,
    commentBody,
  ]);
  connection.release();
  return res.status(200).send({ result, message: "Comment Created" });
});

router.get("/getComments/:taskId", [auth], async (req, res) => {
  const taskId = req.params.taskId;
  const connection = await db.getConnection();
  const query = "SELECT * FROM Comment WHERE taskId = ?";
  const result = await connection.query(query, [taskId]);
  connection.release();
  if (result.length === 0)
    return res.status(404).send({ message: "No comments found" });
  return res.status(200).send(result[0]);
});

module.exports = router;
