const getTrips = require("../services/tripServices");
const tripRouter = require("express").Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const CustomError = require("../utils/createCustomeError");

tripRouter.post(
  "/details",
  catchAsyncError(async (req, res) => {
    let { sourceCityId, destinationCityId, travelDate } = req.body;

    // handling if query data is not present
    if (!sourceCityId || !destinationCityId || !travelDate) {
      throw new CustomError("Please provide proper query details", 400);
    }
    const data = await getTrips(req.body, res);
    res.status(200).json(data);
  })
);

module.exports = tripRouter;
