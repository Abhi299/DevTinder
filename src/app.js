const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const { validateSignupData } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    validateSignupData(req.body);

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new UserModel({
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

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
      res.send("Login successful");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const users = await UserModel.find({ email: email });
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error fetching users" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await UserModel.find();
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error fetching users" + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const email = req.body.email;
  try {
    await UserModel.deleteOne({ email: email });
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Error deleting user" + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updatedData = req.body;
  try {
    const UPDATES_ALLOWED = ["password", "gender", "skills"];

    const isUpdateAllowed = Object.keys(updatedData).every((update) =>
      UPDATES_ALLOWED.includes(update),
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed.");
    }

    if (updatedData.skills.length > 5) {
      throw new Error("Skills cannot be more than 5.");
    }

    await UserModel.findByIdAndUpdate(userId, updatedData);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Error updating user: " + err.message);
  }
});

connectDB()
  .then(() => {
    app.listen(3200, () => {
      console.log("server listening on port 3200");
    });
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
