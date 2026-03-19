const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName email age gender skills photoUrl",
    );

    res.json({
      message: "Requests fetched successfully!",
      receivedRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstName lastName email age gender skills photoUrl",
      )
      .populate(
        "toUserId",
        "firstName lastName email age gender skills photoUrl",
      );

    const data = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hiddenUserIds = new Set();

    connectionRequests.forEach((request) => {
      hiddenUserIds.add(request.fromUserId.toString());
      hiddenUserIds.add(request.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: { $ne: loggedInUser._id },
        },
        {
          _id: { $nin: Array.from(hiddenUserIds) },
        },
      ],
    }).select("firstName lastName email age gender skills photoUrl");

    res.send(users);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
