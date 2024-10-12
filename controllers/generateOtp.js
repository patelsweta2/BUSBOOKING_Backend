const { verifyOtp, generateOtp } = require("../services/OtpService");
const router = require("express").Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const CustomError = require("../utils/createCustomeError");

router.post(
  "/generate-otp",
  catchAsyncError(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      throw new CustomError("Email is required", 400);
    }
    const message = await generateOtp({ email });
    return res.status(200).json({ message: message });
  })
);

// Route to verify OTP
router.post(
  "/verify-otp",
  catchAsyncError(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new CustomError("Email and OTP are required", 400);
    }
    const verificationMessage = await verifyOtp({ email, otp });
    return res.status(200).json({ message: verificationMessage });
  })
);

module.exports = router;
