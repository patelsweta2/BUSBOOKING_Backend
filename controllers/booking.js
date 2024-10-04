const Booking = require("../models/booking");

const bookingController = async (req, res) => {
  try {
    const { tripId, busId, seats } = req.body;
    const user = req.user; //assuming the user is authenticated
    if (!tripId || !busId || !seats || seats.length === 0) {
      return res.status(400).json({ error: "Please select the seat No" });
    }
    for (let seat of seats) {
      if (!seat.name || seat.name.split(" ").length < 2) {
        return res
          .status(400)
          .json({ error: "Passenger name must be greater then 2 words" });
      }
      if (!seat.age || seat.age < 1 || seat.age > 100) {
        return res
          .status(400)
          .json({ error: "Age must be between 1 and 100." });
      }
      if (!["male", "female", "other"].includes(seat.gender.toLowerCase())) {
        return res
          .status(400)
          .json({ error: "Gender must be 'male', 'female', or 'other'." });
      }
      if (!seat.seatNumber || typeof seat.seatNumber !== "number") {
        return res
          .status(400)
          .json({ error: "Seat number must be a valid number." });
      }
    }
    // create booking entries
    const bookings = seats.map((seat) => ({
      tripId,
      busId,
      user: user.id, // authenticated userId
      seatNumber: seat.seatNumber,
      price: calculatePrice(seat.seatNumber),
      seats_booked: seats.length,
    }));
    const newBookings = await Booking.create(bookings);
    res.status(201).json({
      message: "Booking Confirmed",
      bookings: newBookings,
      userDetails: {
        contactNumber: user.contactNumber,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const calculatePrice = async (req, res) => {};
