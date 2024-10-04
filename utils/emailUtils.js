const nodemailer = require("nodemailer");

const sendVerificationMail = (email, otp) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMPT_USERID,
        pass: process.env.SMPT_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMPT_USERID,
      to: email,
      subject: "Email Verification for Your App",
      text: `Your OTP for email verification is ${otp}. It is valid for 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject("OTP sharing failed. Please try again.");
      } else {
        console.log("Email sent: " + info.response);
        resolve("OTP sent successfully.");
      }
    });
  });
};

module.exports = { sendVerificationMail };
