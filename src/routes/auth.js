const express = require("express");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validations");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req.body);

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error creating user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid email or password. Please try again.");
    }

    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password. Please try again.");
    } else {
      const token = await user.getJwt();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      const loggedInUser = user.toObject();
      delete loggedInUser.password;
      delete loggedInUser.__v;

      res.json({ message: "Login successful", user: loggedInUser });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logout successful");
});

module.exports = authRouter;
