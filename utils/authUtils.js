const CustomError = require("../utils/createCustomeError");
//validate email format using your regex
const isEmailValidate = (key) => {
  const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(key);
  return isEmail;
};

// validate user data
const userDataValidation = ({ fullName, email, password, gender }) => {
  if (!fullName || !email || !password || !gender) {
    throw new CustomError("Missing required user data", 400);
  }

  if (typeof email !== "string")
    throw new CustomError("Email must be a string", 400);
  if (typeof fullName !== "string")
    throw new CustomError("Full name must be a string", 400);
  if (typeof password !== "string")
    throw new CustomError("Password must be a string", 400);
  if (typeof gender !== "string")
    throw new CustomError("Gender must be a string", 400);

  if (fullName.length < 5 || fullName.length > 50) {
    throw new CustomError("Full name length should be 5 - 50 characters", 400);
  }

  if (!isEmailValidate(email)) {
    throw new CustomError("Email format is incorrect", 400);
  }
};

const userOtpMailValidation = ({ email }) => {
  if (!email) {
    throw new CustomError("Missing required email data", 400);
  }

  if (typeof email !== "string")
    throw new CustomError("Email must be a string", 400);

  if (!isEmailValidate(email)) {
    throw new CustomError("Email format is incorrect", 400);
  }
};

module.exports = { userDataValidation, isEmailValidate, userOtpMailValidation };
