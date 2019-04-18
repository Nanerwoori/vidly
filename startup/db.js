const mongoose = require("mongoose");
const config = require("config");
const winston = require("winston");

module.exports = function() {
  mongoose
    .connect(config.get("MONGODB_URI"), {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => winston.info("mongoDB is connected ..... "));
  // i will remove catch, bcz i want to log that exception and terminate process.
  // .catch(err => console.log("Could not connect to mongoDB ", err));
};
