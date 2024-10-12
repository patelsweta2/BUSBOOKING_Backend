const { getAllCities } = require("../services/cityService");
const express = require("express");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const CustomError = require("../utils/createCustomeError");

router.get(
  "/cities",
  catchAsyncError(async (req, res) => {
    const cities = await getAllCities();
    // If no cities are found, throw a 404 error
    if (!cities || cities.length === 0) {
      throw new CustomError("No cities found", 404);
    }
    res.status(200).json(cities);
  })
);

module.exports = router;
