const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First name must be at least 3 characters long"],
      trim: true,
      match: [/^[A-Za-z]+(?: [A-Za-z]+)*$/g, "Please fill a valid first name"],
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      match: [/^[A-Za-z]+$/, "Please fill a valid last name"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validator: function (value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validator: function (value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      trim: true,
      min: [18, "Age must be at least 18"],
    },
    gender: {
      type: String,
      required: true,
      trim: true,
      validator: function (value) {
        if (["male", "female", "other"].includes(value.toLowerCase())) {
          return true;
        }
        return false;
      },
    },
    skills: {
      type: [String],
      required: true,
      trim: true,
    },
    photoUrl: {
      type: String,
      required: false,
      trim: true,
      default: "https://www.istockphoto.com/photos/man-profile",
      validator: function (value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid URL format");
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
