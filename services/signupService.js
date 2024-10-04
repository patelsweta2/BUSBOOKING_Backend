const bcrypt = require("bcryptjs");
const { userDataValidation } = require("../utils/authUtils").default;
const userModel = require("../models/user");

const userSignup = async (userData) => {
  const { fullName, gender, dob, email, contactNumber, password } = userData;

  try {
    await userDataValidation({
      fullName,
      email,
      password,
      gender,
      contactNumber,
    });
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contactNumber }],
    });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT)
    );
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const otpExpires = Date.now() + 10 * 60 * 100;

    const newUser = new userModel({
      fullName,
      gender,
      dob,
      email,
      contactNumber,
      password: hashedPassword,
    });
    await newUser.save();
    return { message: "User registered successfully." };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { userSignup };
