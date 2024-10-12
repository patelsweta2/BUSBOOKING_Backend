const { bookingModel } = require("../models/booking");
const busModel = require("../models/bus");
const tripModel = require("../models/trip");
const CustomError = require("../utils/createCustomeError");

const bookTrip = async (bookingData, user) => {
  console.log(user);
  const { tripId, boardingPointId, droppingPointId, seatsInfo, pocDetails } =
    bookingData;

  const validateBookingData = (data) => {
    const { tripId, boardingPointId, droppingPointId, seatsInfo, pocDetails } =
      data;

    if (
      !tripId ||
      !boardingPointId ||
      !droppingPointId ||
      !seatsInfo ||
      !pocDetails
    ) {
      throw new CustomError("Booking details are missing", 400);
    }

    if (!Array.isArray(seatsInfo) || seatsInfo.length === 0) {
      throw new CustomError("Seats information is required", 400);
    }

    for (const seat of seatsInfo) {
      if (!seat.seatNumber || !seat.name || !seat.age || !seat.gender) {
        throw new CustomError("Invalid seat information", 400);
      }

      if (!["M", "F", "O"].includes(seat.gender)) {
        throw new CustomError("Invalid gender value", 400);
      }
    }

    if (!pocDetails.phoneNumber || !pocDetails.email) {
      throw new CustomError("Invalid point of contact details", 400);
    }

    return true;
  };

  try {
    validateBookingData({
      tripId,
      boardingPointId,
      droppingPointId,
      seatsInfo,
      pocDetails,
    });

    const trip = await tripModel.findById({ _id: tripId });

    if (!trip) {
      throw new CustomError("Trip not found", 404);
    }

    const bus = await busModel.findById({ _id: trip.busId });

    if (!bus) {
      throw new CustomError("Bus associated with this trip not found", 404);
    }

    const newBooking = new bookingModel({
      tripId,
      userId: user._id,
      bookingTime: Date.now(),
      seatsInfo,
      pocDetails,
      boardingPointId,
      droppingPointId,
    });

    await newBooking.save();
    return { message: "Booking successful", newBooking };
  } catch (error) {
    console.log(error);
    throw new CustomError(error.message || "Booking failed", 500);
  }
};

module.exports = { bookTrip };
