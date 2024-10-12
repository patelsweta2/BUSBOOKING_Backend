const bcrypt = require("bcryptjs");
const { userDataValidation } = require("../utils/authUtils");
const userModel = require("../models/user");
const otp = require("../models/otp");
const catchAsyncError = require("../middleware/catchAsyncError");
const CustomError = require("../utils/createCustomeError");

const userSignUp = catchAsyncError(async (userData) => {
  const { fullName, gender, dob, email, contactNumber, password } = userData;

  // validate user data
  await userDataValidation({
    fullName,
    gender,
    email,
    contactNumber,
    password,
  });

  // check if user already exists
  const existingUser = await userModel.findOne({
    $or: [{ email }, { contactNumber }],
  });
  if (existingUser) {
    throw new CustomError(
      "User already exists with this email or contact number",
      400
    );
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT)
  );

  // check OTP record
  const otpRecord = await otp.findOne({ email });
  if (!otpRecord || !otpRecord.isEmailVerified) {
    throw new CustomError("OTP not verified for this email.", 400);
  }

  // create and save new user
  const newUser = new userModel({
    fullName,
    gender,
    dob,
    email,
    contactNumber,
    password: hashedPassword,
  });
  await newUser.save();
  return "User register successfully";
});

module.exports = { userSignUp };
