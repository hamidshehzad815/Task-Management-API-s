const nodemailer = require("nodemailer");

module.exports = async function sendEmail(email) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `<h1>Email Verification</h1>
               <p>You are successfully registered on TASK MANAGEMENT</p>`,
  };

  await transporter.sendMail(mailOptions);
};
