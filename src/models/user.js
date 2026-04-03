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
        values: ["male", "female", "others"],
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
      default:
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1327592506%2Fvector%2Fdefault-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DBpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg%3D&f=1&nofb=1&ipt=ee1cc2ebadfa074ec06f66cf9dbbacb178d5952f78ed6a3150ae88d54499925f",
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
