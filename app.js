const express = require("express");

const app = express();
const cityRouter = require("./routes/cityRoute");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/city", cityRouter);
app.use("/api/user", userRouter);

module.exports = app;
