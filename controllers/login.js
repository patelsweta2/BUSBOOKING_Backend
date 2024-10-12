const { userLogin } = require("../services/loginService");
const catchAsyncError = require("../middleware/catchAsyncError");
const CustomError = require("../utils/createCustomeError");
const router = require("express").Router();

router.post(
  "/login",
  catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      // If email or password is missing, throw a CustomError
      throw new CustomError("Email and password are required", 400);
    }

    // Try to log the user in and get the token
    const token = await userLogin({ email, password });

    // Set a cookie and respond with success message and token
    return res
      .status(200)
      .cookie("token", {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: "Welcome back",
        success: true,
        token,
      });
  })
);

// Custom error-handling middleware for handling CustomError
router.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
    });
  }

  // If it's a generic error, send a 500 status code
  return res.status(500).json({
    message: "Server error occurred during login",
    success: false,
    error: err.message,
  });
});

module.exports = router;
