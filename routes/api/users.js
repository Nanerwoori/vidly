const express = require("express");
const router = express.Router();
const { User, validateUser } = require("../../models/User");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../../middleware/auth");

router.get("/me", auth, (req, res) => {
  User.findById(req.user._id)
    .select("-password")
    .then(user => {
      if (!user) return res.json({ msg: "Could not find user." });
      res.json(user);
    })
    .catch(err => {
      console.log(err);
      res.redirect("/");
    });
});

// Regsiter User
router.post("/", (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user)
        return res.status(400).json({ msg: "you are already registered" });

      const newUser = new User(_.pick(req.body, ["name", "email", "password"]));

      bcrypt.genSalt(10).then(salt => {
        bcrypt.hash(newUser.password, salt).then(hash => {
          newUser.password = hash;

          newUser.save().then(user => {
            // If success, Create token and set that token to response header

            const token = user.generateAuthToken();

            res
              .header("x-auth-token", token)
              .json(_.pick(user, ["_id", "name", "email"]));
          });
        });
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
