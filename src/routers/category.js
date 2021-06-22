const express = require("express");

const Category = require("../models/category");
const auth = require("../middleware/auth");

const router = new express.Router();

// Creating Category
router.post("/categories", auth, async (req, res) => {
  const category = new Category({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await category.save();
    res.status(201).send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get All Categories
router.get("/categories", auth, async (req, res) => {
  try {
    await req.user.populate("categories").execPopulate();
    res.send(req.user.categories);
  } catch (e) {
    res.status(500).send();
  }
});

// Update Category
router.patch("/categories/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const category = await Category.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!category) {
      return res.status(404).send();
    }

    updates.forEach((update) => (category[update] = req.body[update]));
    await category.save();
    res.send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete Category
router.delete("/categories/:id", auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!category) {
      res.status(404).send();
    }

    res.send(category);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
