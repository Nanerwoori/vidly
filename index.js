const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => winston.info("Server is running on port " + PORT));
