const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const sendVerificationMail = require("../utils/emailUtils");

const sendOtp = async ({ email }) => {
  if (!email) {
    throw new Error("Please enter your email Id or password");
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User does not exists");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendVerificationMail(user.email, otp);
    return { message: "OTP has been sent to your email." };
  } catch (error) {
    throw new Error(error.message);
  }
};

const verifyOtp = async ({ email, otp }) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("User does not exist");
  }
  // check if OTP has expire
  if (user.otpExpires < Date.now()) {
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    throw new Error("OTP has expired. Please request a new one.");
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP");
  }
  user.otp = null;
  user.otpExpires = null;
  await user.save();
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return { message: "Login Successfully", token };
};

module.exports = { sendOtp, verifyOtp, logoutService };
