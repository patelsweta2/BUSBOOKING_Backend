require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.SMPT_USERID,
      pass: process.env.SMPT_PASS,
    },
    secure: true,
  });

  let mailOptions = {
    from: process.env.SMPT_USERID,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: " + error);
  }
};

module.exports = sendEmail;
