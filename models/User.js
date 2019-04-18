const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
  /**
   * i can add more complex roles string. or obejct in array
   * roles:['']
   *
   *
   * and.. in case of more advanced application.
   * instead of managing roles, i would manage operaions that a user is allowed to perform
   * operations:[]
   * for examples, this user can create and delete genre
   *
   */
});

// I can use this method
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin
    },
    config.get("jwtSecretKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
