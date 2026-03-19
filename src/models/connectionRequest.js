const mongoose = require("mongoose");

const ConnectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema,
);

module.exports = ConnectionRequest;
