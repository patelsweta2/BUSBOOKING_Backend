const jwt = require("jsonwebtoken");
const catchAsyncError = require("../middleware/catchAsyncError");
const CustomError = require("../utils/createCustomeError");

const authenticateUser = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;

  // If no token is found, throw a 401 error
  if (!token) {
    throw new CustomError("User not authenticated", 401);
  }
  // verify the token
  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

  // if token verification fails, throw an invalid token error
  if (!decodedToken) {
    throw new CustomError("Invalid token", 401);
  }
  req.id = decodedToken.userId;
  next();
});

module.exports = authenticateUser;
