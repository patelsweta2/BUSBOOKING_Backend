const isEmailValidate = (key) => {
  const email = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const isEmail = email.test(key);
  return isEmail;
};

const isContactNumberValidate = (num) => {
  const number = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
  const isValidNumber = number.test(num);
  return isValidNumber;
};

const userDataValidation = ({
  fullName,
  email,
  password,
  gender,
  contactNumber,
}) => {
  return new Promise((resolve, reject) => {
    if (!fullName || !email || !password || !gender) {
      return reject("All fields are required");
    }
    if (typeof email !== "string") return reject("Email must be a string");
    if (typeof fullName !== "string")
      return reject("Full name must be a string");
    if (typeof password !== "string")
      return reject("Password must be a string");
    if (typeof gender !== "string") return reject("Gender must be a string");

    if (fullName.length < 5 || fullName.length > 25) {
      return reject("Full name length should be 5 - 25 characters");
    }
    if (!isEmailValidate(email)) {
      return reject("Email format is incorrect");
    }
    if (!isContactNumberValidate(contactNumber)) {
      return reject("Contact Number is invalid");
    }
    resolve();
  });
};

export default { userDataValidation, isEmailValidate };
