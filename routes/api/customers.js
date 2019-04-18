const express = require("express");
const router = express.Router();
const { Customer, validete } = require("../../models/Customer");

// Get all Customer
router.get("/", (req, res) => {
  Customer.find()
    .then(customers => res.json(customers))
    .catch(err => {
      console.log(err);
    });
});

// Show Single Customer
router.get("/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then(customer => res.json(customer))
    .catch(err => {
      console.log(err);
      return { msg: "Could not find genre with the id : " + req.params.id };
    });
});

router.post("/", (req, res) => {
  // Vaidation using JOI
  const { error } = validete(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  const isGold = req.body.isGold ? true : false;

  new Customer({ name: req.body.name, phone: req.body.phone, isGold })
    .save()
    .then(customer => res.json(customer))
    .catch(err => {
      console.log(err);
      res.json({ msg: "Could not create genre" });
    });
});

router.put("/:id", (req, res) => {
  const { error } = validete(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  Customer.findById(req.params.id).then(customer => {
    if (!customer)
      return res.status(404).json({ msg: "Could not fine the customer" });

    if (req.body.name) customer.name = req.body.name;
    if (req.body.phone) customer.phone = req.body.phone;
    if (req.body.isGold) customer.isGold = req.body.isGold;

    customer
      .save()
      .then(customer => res.json(customer))
      .catch(err => console.log(err));
  });
});

router.delete("/:id", (req, res) => {
  Customer.findByIdAndDelete(req.params.id)
    .then(customer => {
      if (!customer)
        return res.status(404).json({ msg: "Could not find the given id" });
      res.json({ success: true });
    })
    .catch(err => {
      console.log("Error occur deleting ... ", err);
      res.status(500).json({ msg: "Could not find the given id" });
    });
});

module.exports = router;
