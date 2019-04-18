const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../../models/User");
const bcrypt = require("bcrypt");

router.post("/login", (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  User.findOne({ email: req.body.email }).then(user => {
    if (!user)
      return res.status(400).json({ msg: "Invalid email or password" });

    bcrypt
      .compare(req.body.password, user.password)
      .then(isMatch => {
        if (!isMatch)
          return res.status(400).json({ msg: "Invalid email or password" });

        const token = user.generateAuthToken();

        return res.json(token);
      })
      .catch(err => console.log("Error", err));
  });
});

function validate(user) {
  schema = {
    email: Joi.string()
      .min(5)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required()
  };

  return Joi.validate(user, schema);
}

module.exports = router;
