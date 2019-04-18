const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../../models/Genre");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
// const asyncrMiddle = require("../../middleware/asyncrMiddle");

// router.get(
//   "/test",
//   asyncrMiddle(async (req, res, next) => {
//     const genres = await Genre.find();
//     res.json(genres);
//   })
// );

// Get all Genres
router.get("/", (req, res, next) => {
  throw new Error("Could not get genres");

  Genre.find()
    .then(genres => res.json(genres))
    .catch(err => next(err));
});

// Show Single Genre
router.get("/:id", (req, res) => {
  Genre.findById(req.params.id)
    .then(genre => res.json(genre))
    .catch(err => {
      console.log(err);
      return { msg: "Could not find genre with the id : " + req.params.id };
    });
});

/**
 * @method POST:/api/genres
 * @private
 * @required token/ name
 *
 * */

router.post("/", auth, (req, res) => {
  // Vaidation using JOI
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ msg: "장르 이름을 입력해주세요" });

  new Genre({ name: req.body.name })
    .save()
    .then(genre => res.json(genre))
    .catch(err => {
      console.log(err);
      res.json({ msg: "Could not create genre" });
    });
});

router.put("/:id", auth, (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ msg: "장르 이름을 입력해주세요" });

  Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    .then(genre => {
      if (!genre)
        return res.status(404).json({ msg: "Could not fine the genre" });
      res.json(genre);
    })
    .catch(err => {
      conso.log(err);
    });
});

/**
 * @method DELETE:/api/genres/:id
 * @private Only Admin
 * */

router.delete("/:id", [auth, admin], (req, res) => {
  Genre.findByIdAndDelete(req.params.id)
    .then(genre => {
      if (!genre)
        return res.status(404).json({ msg: "Could not find the given id" });
      res.json({ success: true });
    })
    .catch(err => {
      console.log("Error occur deleting ... ", err);
      res.status(500).json({ msg: "Could not find the given id" });
    });
});

module.exports = router;
