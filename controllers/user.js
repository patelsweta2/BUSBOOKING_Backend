const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const OTP = require("../models/otp");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmails");

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const registerController = async (req, res) => {
  const { fullName, gender, dob, email, contactNumber, password } = req.body;

  if (!fullName || !gender || !dob || !email || !contactNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExist = await userModel.findOne({
      $or: [{ email }, { contactNumber }],
    });
    if (userExist) {
      return res.status(400).json({
        message: "User with this email or contact number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      fullName,
      gender,
      dob,
      email,
      contactNumber,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const requestOtpController = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ message: "User with this email does not exist" });
  }

  const otp = generateOTP();
  const expiresAt = Date.now() + 15 * 60 * 1000; // otp valid for 15 mins

  // save otp to database
  await OTP.findOneAndUpdate({ email }, { otp, expiresAt }, { upsert: true });
  const message = `Hi, Your OTP code is ${otp}`;
  await sendEmail(email, "Your OTP Code", message);

  res.status(200).send("OTP sent to your email");
};

const verifyOtpController = async (req, res) => {
  const { email, otp, password } = req.body;

  // verify otp
  const otpRecord = await OTP.findOne({ email, otp });
  if (!otpRecord || otpRecord.expiresAt < Math.floor(Date.now() / 1000)) {
    return res.status(400).send("Invalid or expired OTP");
  }
  // Delete OTP record
  await OTP.deleteOne({ email, otp });

  const user = await userModel.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).send("Invalid email or password");
  }

  // Generate JWT token
  const token = generateToken(user._id);

  // Successful login
  res.status(200).json({ message: "Logged in successfully", token });
};

const loginController = async (req, res) => {
  const { contactNumber, password } = req.body;
  try {
    const user = await userModel.findOne({ contactNumber });
    if (!user) {
      res.status(400).send("Invalid Contact Number");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).send("Invalid Password");
    }
    const token = generateToken(user._id);
    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerController,
  requestOtpController,
  verifyOtpController,
  loginController,
};
