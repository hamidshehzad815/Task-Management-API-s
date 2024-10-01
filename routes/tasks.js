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
const {
  validations,
  validate,
} = require("../middleware/taskUpdateValidations");

router.delete("/delete-task/:taskId", [auth], async (req, res) => {
  const taskId = req.params?.taskId;

  if (!taskId || isNaN(taskId)) {
    return res.status(400).send({ message: "Invalid task ID" });
  }

  const connection = await db.getConnection();
  const user = req.user;
  let query;

  if (user.role === "Admin") {
    query = "DELETE FROM Task WHERE taskId = ?";
  } else {
    query = "DELETE FROM Task WHERE taskId = ? AND createdBy = ?";
  }

  const result = await connection.query(
    query,
    user.role === "Admin" ? [taskId] : [taskId, user.userId]
  );

  connection.release();

  if (result[0].affectedRows === 0) {
    return res.status(404).send({ message: "Task not found" });
  }

  return res.status(200).send({ message: "Task deleted" });
});

router.post(
  "/createTask",
  [auth, ...requestValidations, validateRequest],
  async (req, res) => {
    const { title, description, dueDate, priority, status, assignedTo } =
      req.body;
    const user = req.user;
    const connection = await db.getConnection();
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
      const emailQuery = "SELECT email FROM User WHERE userId = ?";
      const [emailResult] = await connection.query(emailQuery, [assignedTo]);

      if (emailResult && emailResult.length > 0) {
        sendEmail(user, emailResult[0].email);
      }
    }
    connection.release();
    return res.status(201).send({ result, message: "Task Created" });
  }
);

router.put(
  "/updateTask",
  [auth, ...validations, validate],
  async (req, res) => {
    const { taskId, title, description, dueDate, priority, status } = req.body;
    const user = req.user;

    const isAdmin = user.role === "Admin";

    const connection = await db.getConnection();

    const query = isAdmin
      ? "UPDATE Task SET title = COALESCE(?, title), description = COALESCE(?, description), dueDate = COALESCE(?, dueDate), priority = COALESCE(?, priority), status = COALESCE(?, status), updatedBy = ? WHERE taskId = ?"
      : "UPDATE Task SET title = COALESCE(?, title), description = COALESCE(?, description), dueDate = COALESCE(?, dueDate), priority = COALESCE(?, priority), status = COALESCE(?, status), updatedBy = ? WHERE taskId = ? AND (createdBy = ? OR assignedTo = ?)";

    const params = isAdmin
      ? [title, description, dueDate, priority, status, user.userId, taskId]
      : [
          title,
          description,
          dueDate,
          priority,
          status,
          user.userId,
          taskId,
          user.userId,
          user.userId,
        ];

    const result = await connection.query(query, params);

    if (result[0].affectedRows === 0) {
      return res.status(404).send({ message: "Task Not Found" });
    }

    connection.release();
    return res.status(200).send({ message: "Task updated" });
  }
);

router.get("/tasks", [auth], async (req, res) => {
  const connection = await db.getConnection();
  const user = req.user;
  const query = "SELECT * FROM Task WHERE createdBy = ? or assignedTo = ?";
  const [tasks] = await connection.query(query, [user.userId, user.userId]);
  connection.release();
  if (tasks.length === 0)
    return res.status(404).send({ message: "No task found" });
  return res.status(200).send(tasks);
});

router.get("/allTasks", [auth, authorization], async (req, res) => {
  const connection = await db.getConnection();
  const query = "SELECT * FROM Task";
  const [tasks] = await connection.query(query);
  connection.release();
  if (tasks.length === 0)
    return res.status(404).send({ message: "No task found" });
  return res.status(200).send(tasks);
});

router.get("/taskFilter/:columnName/:filterBy", [auth], async (req, res) => {
  const user = req.user;
  const filterBy = req.params.filterBy;
  const columnName = req.params.columnName;

  const allowedColumns = ["status", "priority"];
  if (!allowedColumns.includes(columnName)) {
    return res.status(400).send({ message: "Invalid column name" });
  }

  const connection = await db.getConnection();
  const query = `SELECT * FROM Task WHERE ${columnName} = ? AND createdBy = ?`;
  const [tasks] = await connection.query(query, [filterBy, user.userId]);
  connection.release();
  if (tasks.length === 0)
    return res.status(404).send({ message: "No task found" });
  return res.status(200).send(tasks);
});

router.get("/taskBy/:sortBy/:sortingOrder?", [auth], async (req, res) => {
  const user = req.user;
  const sortBy = req.params.sortBy;
  const sortingOrder = req.params.sortingOrder || "asc";

  const allowedSortByFields = [
    "title",
    "description",
    "dueDate",
    "priority",
    "status",
  ];
  const allowedSortingOrders = ["asc", "desc"];

  if (!allowedSortByFields.includes(sortBy)) {
    return res.status(400).send({ message: "Invalid sortBy field." });
  }

  if (!allowedSortingOrders.includes(sortingOrder.toLowerCase())) {
    return res
      .status(400)
      .send({ message: "Invalid sorting order. Use 'asc' or 'desc'." });
  }
  const connection = await db.getConnection();
  const query = `SELECT * FROM Task WHERE createdBy = ? ORDER BY ${sortBy} ${sortingOrder.toUpperCase()}`;

  const [tasks] = await connection.query(query, [user.userId]);
  connection.release();
  if (tasks.length === 0)
    return res.status(404).send({ message: "No task found" });
  return res.status(200).send(tasks);
});
module.exports = router;
