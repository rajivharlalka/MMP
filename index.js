var nodemailer = require("nodemailer");
require("dotenv").config();

console.log(process.env.GMAIL_EMAIL);
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
});

var mailOptions = {
  from: process.env.GMAIL_EMAIL,
  to: "rajivharlalka009@gmail.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
