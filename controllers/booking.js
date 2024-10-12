const { bookTrip } = require("../services/bookingService");
const authenticateUser = require("../utils/authenticateUser");
const catchAsyncError = require("../middleware/catchAsyncError");
const CustomError = require("../utils/createCustomeError");

const router = require("express").Router();

router.post(
  "/post",
  authenticateUser,
  catchAsyncError(async (req, res) => {
    const bookedDetails = await bookTrip(req.body, req.id);
    return res
      .status(200)
      .json({ message: "Booking successful", bookedDetails });
  })
);

module.exports = router;
