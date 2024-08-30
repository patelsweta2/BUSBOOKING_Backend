const express = require("express");
const {
  registerController,
  requestOtpController,
  verifyOtpController,
  loginController,
} = require("../controllers/user");
const router = express.Router();

router.post("/register", registerController);
router.post("/request-otp", requestOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/login", loginController);

module.exports = router;
