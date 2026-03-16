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
    console.log(err);
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
