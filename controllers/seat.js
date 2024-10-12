const seatRouter = require("express").Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const CustomError = require("../utils/createCustomeError");
const { getSeatLayout } = require("../services/seatServices");

seatRouter.get(
  "/layout",
  catchAsyncError(async (req, res) => {
    console.log(req.query.tripId);
    if (!req.query.tripId) {
      throw new CustomError("Please provide a valid tripId", 400);
    }
    const data = await getSeatLayout(req.query);
    if (!data) {
      throw new CustomError("No trips found for tripId", 404);
    }
    res.status(200).json(data);
  })
);

module.exports = seatRouter;
