const express = require("express");
const { cityController } = require("../controllers/city");
const cityRouter = express.Router();

cityRouter.get("/home", cityController);

module.exports = cityRouter;
