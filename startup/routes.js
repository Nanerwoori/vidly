const express = require("express");
const error = require("../middleware/error");
module.exports = function(app) {
  app.use(express.json());

  // Route
  app.use("/api/genres", require("../routes/api/genres"));
  app.use("/api/customers", require("../routes/api/customers"));
  app.use("/api/movies", require("../routes/api/movies"));
  app.use("/api/rentals", require("../routes/api/rentals"));
  app.use("/api/users", require("../routes/api/users"));
  app.use("/api/auth", require("../routes/api/auth"));

  // Only Admin Route ....

  // Error Handling
  app.use(error);
};
