const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhimishra299_db_user:2gYjr2H83isX6HVC@devtinder.wndmhcn.mongodb.net/?appName=DevTinder",
  );
  console.log("database connected successfully!");
};

module.exports = connectDB;
