const config = require("config");

module.exports = function() {
  if (!config.get("jwtSecretKey")) {
    throw new Error("Fatal Error : jwtSecretKey is not defined");
    process.exit(1); // 0 means success, others means failure
  }
};
