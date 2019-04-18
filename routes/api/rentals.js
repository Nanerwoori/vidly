const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const { Rental, validateRental } = require("../../models/Rental");
const { Customer } = require("../../models/Customer");
const { Movie } = require("../../models/Movie");

// Init Fawn
Fawn.init(mongoose);
const task = Fawn.Task();

// Get All Rentals
router.get("/", (req, res) => {
  Rental.find()
    .sort("-dateOut")
    .then(rentals => {
      return res.json(rentals);
    })
    .catch(err => console.log(err));
});

router.get("/:id", (req, res) => {
  Rental.findById(req.params.id)
    .then(rental => {
      if (!rental)
        return res
          .status(404)
          .json({ msg: "Could not find rental with that id" });
      res.json(rental);
    })
    .catch(err => console.log(err));
});

// Create new rental
router.post("/", (req, res) => {
  // Validate as client side
  const { error } = validateRental(req.body);
  if (error) return res.status(400).json({ msg: error.details[0].message });

  // Make suer customer id && movie id is obejctId
  if (
    !mongoose.Types.ObjectId.isValid(req.body.customerId) ||
    !mongoose.Types.ObjectId.isValid(req.body.movieId)
  ) {
    return res.status(400).json({ msg: "Invalid id" });
  }

  Customer.findById(req.body.customerId).then(customer => {
    Movie.findById(req.body.movieId).then(movie => {
      if (!customer || !movie)
        return res.status(400).json({ msg: "Invalid id or NO found id" });

      const newRental = new Rental({
        customer: {
          _id: customer._id,
          name: customer.name,
          phone: customer.phone
        },
        movie: {
          _id: movie._id,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate
        }
      });

      // Define task as a unit
      try {
        task
          .save("rentals", newRental)
          .update(
            "movies",
            { _id: movie._id },
            { numberInStock: movie.numberInStock - 1 }
          )
          .run()
          .then(results => {
            console.log("Rental Results :", results[0]);
            console.log("Movie Results :", results[1]);
            return res.json(results[0]);
          });
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Something went wrong ... " });
      }

      /**
       * 
       newRental.save().then(rental => {
           if (rental) {
               movie.numberInStock--;
               movie.save().then(movie => {
                   console.log("mvoie stock updated");
                   res.json(rental);
                });
            }
        });
        */
    });
  });
});

module.exports = router;
