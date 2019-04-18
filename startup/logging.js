const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  process.on("uncaughtException", (err, req, res) => {
    console.log("We Got An Uncaught Exception");
    winston.error(err.message, err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err, req, res) => {
    console.log("We Got An Unhandled Rejection");
    winston.error(err.message, err);
    process.exit(1);
  });

  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.MongoDB, {
    db: config.get("MONGODB_URI"),
    level: "info"
  });
};
