const ForgetPassTemplate = (CustomerName, RestaurantName, resetToken) => {
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  return `
    <h2>Hello ${CustomerName} 👋</h2>
    <p>You requested to reset your password for <b>${RestaurantName}</b>.</p>

    <p>
      Click the button below to reset your password:
    </p>

    <a href="${resetUrl}"
       style="padding:10px 20px;background:#facc15;color:#000;
       text-decoration:none;border-radius:6px;font-weight:bold;">
       Reset Password
    </a>

    <p>This link will expire in <b>15 minutes</b>.</p>

    <p>If you didn’t request this, please ignore this email.</p>

    <br/>
    <b>${RestaurantName} Team</b>
  `;
};

export default ForgetPassTemplate;