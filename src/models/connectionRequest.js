const mongoose = require("mongoose");

const ConnectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["accepted", "ignored", "interested", "rejected"],
    },
  },
  { timestamps: true },
);

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

ConnectionRequestSchema.pre("save", async function () {
  const existingRequest = await this.constructor.findOne({
    $or: [
      { fromUserId: this.fromUserId, toUserId: this.toUserId },
      { fromUserId: this.toUserId, toUserId: this.fromUserId },
    ],
  });

  if (existingRequest) {
    throw new Error("Connection request exists");
  }

  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema,
);

module.exports = ConnectionRequest;
