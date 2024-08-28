const express = require("express");

const app = express();
const cityRouter = require("./routes/cityRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", cityRouter);

module.exports = app;
