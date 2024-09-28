const express = require("express");
const router = express.Router();
const db = require("../database/database");
const auth = require("../middleware/auth");
const authorization = require("../middleware/authorization");
const { taskAssignedEmail: sendEmail } = require("../services/sendEmail");
const {
  requestValidations,
  validateRequest,
} = require("../middleware/taskCreationMiddleware");
router.post(
  "/api/createTask",
  [auth, ...requestValidations, validateRequest],
  async (req, res) => {
    const { title, description, dueDate, priority, status, assignedTo } =
      req.body;
    const user = req.user;
    const connection = await db.getConnection();
    connection.query("USE TASK_MANAGEMENT");
    const query =
      "INSERT INTO Task VALUES(DEFAULT,?,?,?,COALESCE(?,DEFAULT(priority)),COALESCE(?,DEFAULT(status)),?,DEFAULT,COALESCE(?,DEFAULT(assignedTo)),DEFAULT,DEFAULT)";
    const result = await connection.query(query, [
      title,
      description,
      dueDate,
      priority,
      status,
      user.userId,
      assignedTo,
    ]);
    if (assignedTo) {
      const query = "SELECT email FROM User WHERE userId = ?";
      const [email] = await connection.query(query, [assignedTo]);
      sendEmail(user, email[0].email);
    }
    connection.release();
    return res.status(200).send({ result, message: "Task Createdd" });
  }
);

router.put(
  "/api/updateMyTask",
  [auth, ...requestValidations, validateRequest],
  async (req, res) => {
    const { taskId, title, description, dueDate, priority, status } = req.body;
    const user = req.user;
    const connection = await db.getConnection();
    connection.query("USE TASK_MANAGEMENT");
    const query =
      "UPDATE Task SET title = COALESCE(?,title), description = COALESCE(?,description), dueDate = COALESCE(?,dueDate),priority= COALESCE(?,priority),status=COALESCE(?,status),updatedBy=? WHERE taskId = ? AND (createdBy = ? OR assignedTo = ?)";
    const result = await connection.query(query, [
      title,
      description,
      dueDate,
      priority,
      status,
      user.userId,
      taskId,
      user.userId,
      user.userId,
    ]);
    if (result[0].affectedRows === 0)
      return res.status(400).send({ message: "Task Not Found" });
    console.log(result);
    connection.release();
    return res.status(200).send({ message: "Task updated" });
  }
);

router.put(
  "/api/updateTask",
  [auth, authorization, ...requestValidations, validateRequest],
  async (req, res) => {
    const { taskId, title, description, dueDate, priority, status } = req.body;
    const user = req.user;
    const connection = await db.getConnection();
    connection.query("USE TASK_MANAGEMENT");
    const query =
      "UPDATE Task SET title = COALESCE(?,title), description = COALESCE(?,description), dueDate = COALESCE(?,dueDate),priority= COALESCE(?,priority),status=COALESCE(?,status),updatedBy=? WHERE taskId = ?";
    const result = await connection.query(query, [
      title,
      description,
      dueDate,
      priority,
      status,
      user.userId,
      taskId,
    ]);
    if (result[0].affectedRows === 0)
      return res.status(400).send({ message: "Task Not Found" });
    console.log(result);
    connection.release();
    return res.status(200).send({ message: "Task updated" });
  }
);

router.get("/api/myTasks", [auth], async (req, res) => {
  const connection = await db.getConnection();
  connection.query("USE TASK_MANAGEMENT");
  const user = req.user;
  const query = "SELECT * FROM Task WHERE createdBy = ? or assignedTo = ?";
  const [tasks] = await connection.query(query, [user.userId, user.userId]);
  connection.release();
  if (tasks.length === 0)
    return res.status(400).send({ message: "No task found" });
  return res.status(200).send(tasks);
});

router.get("/api/allTasks", [auth, authorization], async (req, res) => {
  const connection = await db.getConnection();
  connection.query("USE TASK_MANAGEMENT");
  const query = "SELECT * FROM Task";
  const [tasks] = await connection.query(query);
  connection.release();
  if (tasks.length === 0)
    return res.status(400).send({ message: "No task found" });
  return res.status(200).send(tasks);
});

router.get(
  "/api/taskFilter/:columnName/:filterBy",
  [auth],
  async (req, res) => {
    const user = req.user;
    const filterBy = req.params.filterBy;
    const columnName = req.params.columnName;
    const connection = await db.getConnection();
    connection.query("USE TASK_MANAGEMENT");
    const query = `SELECT * FROM Task WHERE ${columnName} = ? AND createdBy = ?`;
    const [tasks] = await connection.query(query, [filterBy, user.userId]);
    connection.release();
    if (tasks.length === 0)
      return res.status(400).send({ message: "No task found" });
    return res.status(200).send(tasks);
  }
);

router.get("/api/taskBy/:sortingOrder", [auth], async (req, res) => {
  const user = req.user;
  const sortingOrder = req.params.sortingOrder;
  const connection = await db.getConnection();
  connection.query("USE TASK_MANAGEMENT");
  const query = `SELECT * FROM Task WHERE createdBy = ? Order By ${sortingOrder}`;
  const [tasks] = await connection.query(query, [user.userId]);
  connection.release();
  if (tasks.length === 0)
    return res.status(400).send({ message: "No task found" });
  return res.status(200).send(tasks);
});

// router.get("/api/taskByPriority", [auth], async (req, res) => {
//   const connection = await db.getConnection();
//   connection.query("USE TASK_MANAGEMENT");
//   const query = "SELECT * FROM Task Order By priority";
//   const [tasks] = await connection.query(query);
//   connection.release();
//   if (tasks.length === 0)
//     return res.status(400).send({ message: "No task found" });
//   return res.status(200).send(tasks);
// });

// router.get("/api/taskByDueDate", [auth], async (req, res) => {
//   const connection = await db.getConnection();
//   connection.query("USE TASK_MANAGEMENT");
//   const query = "SELECT * FROM Task Order By dueDate";
//   const [tasks] = await connection.query(query);
//   connection.release();
//   if (tasks.length === 0)
//     return res.status(400).send({ message: "No task found" });
//   return res.status(200).send(tasks);
// });
module.exports = router;
