const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
      required: false,
      trim: true,
      min: [18, "Age must be at least 18"],
    },
    gender: {
      type: String,
      required: false,
      trim: true,
      enum: {
        values: ["Male", "Female", "Others"],
        message: "{VALUE} is not a valid gender",
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

userSchema.methods.getJwt = async function () {
  const user = this;

  const token = await jwt.sign({ id: user._id }, "secretkey", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.verifyPassword = async function (password) {
  const user = this;

  const isPasswordValid = await bcrypt.compare(password, user.password);

  return isPasswordValid;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
