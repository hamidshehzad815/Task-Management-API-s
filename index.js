require("dotenv").config();
require("express-async-errors");
const express = require("express");
const PORT = process.env.PORT;

const app = express();
require("./start/routes")(app);

app.listen(PORT, () => {
  console.log(`Server running on PORT : ${PORT}`);
});
