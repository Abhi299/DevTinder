const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateProfileData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    delete loggedInUser.password;
    delete loggedInUser.__v;

    res.json({ message: "Profile fetched successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).json({ error: "Error: " + err.message });
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Invalid fields in request body");
    }

    const user = req.user;

    Object.keys(req.body).forEach((field) => {
      user[field] = req.body[field];
    });

    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.__v;

    await user.save();
    res.json({ message: "Profile updated successfully", data: updatedUser });
  } catch (err) {
    res.status(400).json({ error: "Error: " + err.message });
  }
});

profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user;

    if (!password) {
      throw new Error("Password is required");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.",
      );
    }
    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    await user.save();
    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
