const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "sweta0442@gmail.com",
      pass: "xcbe dvac gaop ggrc",
    },
    secure: true,
  });

  let mailOptions = {
    from: "sweta0442@gmail.com",
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
