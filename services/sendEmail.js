const nodemailer = require("nodemailer");

async function registraionEmail(email) {
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
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333; text-align: center;">Welcome to Task Management!</h1>
          <p style="color: #555; font-size: 16px;">Congratulations! You have successfully registered on <strong>Task Management</strong>.</p>

          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #28a745; background-color: #e9f7ef;">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Please verify your email to complete your registration. Click the button below to confirm your email address.
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="YOUR_VERIFICATION_LINK" style="text-decoration: none; padding: 10px 20px; background-color: #28a745; color: white; border-radius: 5px; font-size: 16px;">Verify Email</a>
            </div>
          </div>

          <p style="color: #555; font-size: 16px;">We are excited to have you on board!</p>
          <p style="color: #555; font-size: 16px;"><strong>Your Task Management Team</strong></p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

          <p style="font-size: 12px; color: #999; text-align: center;">
            If you did not sign up for this account, please disregard this email.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function taskAssignedEmail(creator, email) {
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
    subject: "Task Assigned",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #333; text-align: center;">Task Assigned</h1>
          <p style="color: #555; font-size: 16px;">Hello,</p>
          <p style="color: #555; font-size: 16px;">You have been assigned a new task by <strong>${creator.username}</strong> (<a href="mailto:${creator.email}" style="color: #1a73e8;">${creator.email}</a>).</p>
          
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #1a73e8; background-color: #f1f8ff;">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Please log in to your account to review the task details and start working on it.
            </p>
          </div>

          <p style="color: #555; font-size: 16px;">Best regards,</p>
          <p style="color: #555; font-size: 16px;"><strong>Your Task Management Team</strong></p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

          <p style="font-size: 12px; color: #999; text-align: center;">
            This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  registraionEmail,
  taskAssignedEmail,
};
