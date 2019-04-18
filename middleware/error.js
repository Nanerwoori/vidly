/*

this only works for errors that happen in thre request processing pipeline
it will ignore anything outside the context of express 

if something goes wrong during our application startup
this function is not going to be executed.

so, in the index.js file, i shoul handle errors that happen in node process


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


after log the error message, it will terminate node, and then i should restart the server

how can i restart server in production ? 
i will use process managers, which are responsible for automatically restrating a node process



*/

const winston = require("winston");

module.exports = function(err, req, res, next) {
  // error
  // warn
  // info
  // verbose
  // debug
  // silly
  winston.error(err.message, err);

  // Log Exceptiong

  // Send response
  res.status(500).send("Something went wrong.");
};
