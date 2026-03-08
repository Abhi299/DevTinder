const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.get("/hello", (req, res) => {
  res.send("Hello hi kehde bete");
});

app.listen(3200, () => {
  console.log("server listening on port 3200");
});
