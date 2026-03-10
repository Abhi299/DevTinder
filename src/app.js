const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObj = req.body;

  try {
    const user = new UserModel(userObj);
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Error creating user" + err.message);
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

app.patch("/user", async (req, res) => {
  const email = req.body.email;
  const updatedData = req.body.data;
  try {
    await UserModel.findOneAndUpdate({ email: email }, updatedData);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Error updating user" + err.message);
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
