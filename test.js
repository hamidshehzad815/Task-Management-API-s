(async () => {
  const db = require("./database/database");
  const connection = await db.getConnection();
  connection.query("USE TASK_MANAGEMENT");

  const query = "SELECT email FROM User WHERE userId = ?";
  const [email] = await connection.query(query, [2]);
  connection.release();
  console.log(email[0].email);
})();
