const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // Check if there is token from header
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({ msg: "Access denied. No token provided." });

  // Check given token is valid
  try {
    const decoded = jwt.verify(token, config.get("jwtSecretKey"));
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ msg: "Access denied. Invalid token" });
  }
};
