const express = require("express");
const session = require("express-session");
const users = require("../routes/users");
const tasks = require("../routes/tasks");
const comments = require("../routes/comments");
const error = require("../middleware/errorhandler");

module.exports = function (app) {
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false, maxAge: 120000 },
    })
  );
  app.use(express.json());
  app.use("/users", users);
  app.use("/tasks", tasks);
  app.use("/comments", comments);
  app.use(error);
};
