const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatuses = ["interested", "ignored"];

    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid status: " + status);
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: fromUserId, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      throw new Error("Connection request exists");
    }

    const toUser = await User.findOne({ _id: toUserId });

    if (!toUser) {
      return res.status(404).send("User not found");
    }

    const connectionRequest = await ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      message: status + " request sent to " + toUser.firstName,
      request: data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { status, requestId } = req.params;

    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status: " + status });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.json({
      message: "Connection request " + status,
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
