const mongoose = require("mongoose");
const Joi = require("joi");
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  phone: {
    type: String
  },
  isGold: {
    type: Boolean,
    default: false
  },
  cratedAt: {
    type: Date,
    default: Date.now
  }
});

function validete(customer) {
  const customerSchema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(2)
      .max(50),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, customerSchema);
}

module.exports.Customer = mongoose.model("Customer", customerSchema);
module.exports.validete = validete;
