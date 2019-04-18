const express = require("express");
const router = express.Router();
const { Movie, validateMovie } = require("../../models/Movie");
const { Genre } = require("../../models/Genre");

// All Movie lists
router.get("/", (req, res) => {
  Movie.find()
    .then(movies => res.json(movies))
    .catch(err => console.log(err));
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});
// Create movie
// required : genre id
router.post("/", (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.json(error.details[0].message);

  Genre.findById(req.body.genreId)
    .then(genre => {
      if (!genre) return res.status(404).json({ msg: "Could not find genre" });

      // Create Movie
      const movie = new Movie({
        title: req.body.title,
        genre: {
          _id: genre.id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      });

      // Save
      movie
        .save()
        .then(movie => res.json(movie))
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.put("/:id", (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.json(error.details[0].message);

  Genre.findById(req.body.genreId)
    .then(genre => {
      if (!genre) return res.status(400).json({ msg: "Invalid genre" });

      Movie.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: req.body.title,
          genre: {},
          numberInStock: req.body.numberInStock,
          dailyRentalRate: req.body.dailyRentalRate
        },
        { new: true }
      ).then(movie => {
        if (!movie)
          return res
            .status(404)
            .json({ msg: "Could not found the movie with that id" });
        res.json(movie);
      });
    })
    .catch(err => {
      console.log("Error occur updating movie", err);
      res.json({ msg: "Something went wrong." });
    });
});

router.delete("/:id", (req, res) => {
  Movie.findOneAndDelete({ _id: req.params.id })
    .then(result => console.log(result))
    .catch(err => console.log(err));
});
module.exports = router;
