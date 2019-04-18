const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50
  },
  created: {
    type: Date,
    default: Date.now
  }
});

function validate(genre) {
  const genreSchema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(genre, genreSchema);
}

module.exports.Genre = mongoose.model("Genre", genreSchema);
module.exports.validate = validate;
module.exports.genreSchema = genreSchema;
