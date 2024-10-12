const { userSignUp } = require("../services/signupService");
const CustomError = require("../utils/createCustomeError");
const catchAsyncError = require("../middleware/catchAsyncError");

const router = require("express").Router();

router.post(
  "/signup",
  catchAsyncError(async (req, res, next) => {
    const result = await userSignUp(req.body);
    return res.status(200).json({ message: result });
  })
);

// Custom Error handler middleware
router.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  //For all other types of errors, return a generic 500 response
  return res.status(500).json({
    message: "Server error occurred during sign-up",
    error: err.message,
  });
});

module.exports = router;
