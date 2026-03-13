const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;

    const { token } = cookie;

    if (!token) {
      throw new Error("Unauthorized. Please log in.");
    }

    const decoded = await jwt.verify(token, "secretkey");
    const { id } = decoded;

    const user = await UserModel.findById(id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized. Please log in.");
  }
};

module.exports = {
  userAuth,
};
