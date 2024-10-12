const Otp = require("../models/otp");
const { userOtpMailvalidate } = require("../utils/authUtils");
const { sendVarificationMail } = require("../utils/emailUtils");
const CustomError = require("../utils/createCustomeError");

const generateOtp = async ({ email }) => {
  try {
    // validate the email
    await userOtpMailvalidate({ email });
    const otpRecord = await Otp.findOne({ email });
    if (otpRecord) {
      throw new CustomError(
        "An OTP has already been generated for this email. Please check your email",
        400
      );
    }

    // Generate a 6-digit random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save the OTP to the database
    const newOtp = new otp({ email, otp: otp });
    await newOtp.save();

    // send OTP via email
    await sendVarificationMail(email, newOtp.otp);
    return "OTP sent to your email.";
  } catch (error) {
    throw new CustomError(error.message || "Failed to generate OTP", 500);
  }
};

const verifyOtp = async ({ email, otp }) => {
  try {
    const otpRecord = await otp.findOne({ email });
    if (!otpRecord) {
      throw new CustomError("User not found", 404);
    }
    if (otpRecord.isEmailVerified) {
      throw new CustomError("OTP has already been verified", 400);
    }
    if (otpRecord.otp !== otp) {
      throw new CustomError("Incorrect OTP", 400);
    }
    otpRecord.isEmailVerified = true;
    await otpRecord.save();
    return "OTP successfully verified";
  } catch (error) {
    throw new CustomError(error.message || "Failed to verify OTP", 500);
  }
};

module.exports = {
  generateOtp,
  verifyOtp,
};
