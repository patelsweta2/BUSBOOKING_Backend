const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const Otp = require("../models/otp");
const CustomError = require("../utils/createCustomeError");

const userLogin = async ({ email, password }) => {
  if (!email || !password) {
    throw new CustomError("Please enter your email and password", 400);
  }
  try {
    // Find user and otp record by email
    const user = await userModel.findOne({ email });
    const otpRecord = await Otp.findOne({ email });

    // check if user exists
    if (!user) {
      throw new CustomError("User does not exist", 404);
    }
    // check if OTP record exists(email verification)
    if (otpRecord === null) {
      throw new CustomError("Verify your email before login", 401);
    }
    // compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid credentials", 401);
    }

    // create token payload and sign JWT token
    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token valid for 1 day
    });
    // return the generated token
    return token;
  } catch (error) {
    throw new CustomError(
      error.message || "Unknown error occurred during login",
      500
    );
  }
};

module.exports = { userLogin };
