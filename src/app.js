const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

connectDB()
  .then(() => {
    app.listen(3200, () => {
      console.log("server listening on port 3200");
    });
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
