const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const globalErrorHandler = require("./middleware/globalErrorHandler");
const cityRouter = require("./controllers/city");
const tripRouter = require("./controllers/trip");
const signUpRouter = require("./controllers/signUp");
const loginRouter = require("./controllers/login");
const bookingRouter = require("./controllers/booking");
const seatRouter = require("./controllers/seat");
const otpRouter = require("./controllers/generateOtp");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(cors());
app.use(cookieParser());

app.use("/city", cityRouter);
app.use("/api/trips", tripRouter);
app.use("/api/seat", seatRouter);
app.use("/register", signUpRouter);
app.use("/auth", loginRouter);
app.use("/booking", bookingRouter);
app.use("/otp", otpRouter);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 8000;
const MODE = process.env.NODE_ENV || "production";

app.listen(PORT, () => {
  console.log(`App is running at ${PORT} in ${MODE} mode`);
});
