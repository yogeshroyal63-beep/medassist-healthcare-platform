const crypto = require("crypto");
const User = require("./auth.model");
const { signToken } = require("../../utils/jwt");
const { hashPassword } = require("../../utils/bcrypt");
const { sendPasswordResetEmail } = require("../../utils/email");
const { adminEmail, adminPassword, frontendUrl } = require("../../config/env");

async function register({ name, email, password, role }) {
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }

  const isDoctor = role === "doctor";
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
    isApproved: isDoctor ? false : true,
  });

  const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });
  return { token, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, isApproved: user.isApproved } };
}

async function login({ email, password }) {
  if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
    const token = signToken({ id: "admin", role: "admin", email: adminEmail });
    return {
      token,
      user: { id: "admin", name: "Admin", email: adminEmail, role: "admin", isApproved: true },
    };
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  const ok = await user.comparePassword(password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });
  return { token, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, isApproved: user.isApproved } };
}

async function me(userId) {
  if (userId === "admin") {
    return { id: "admin", name: "Admin", email: adminEmail, role: "admin", isApproved: true };
  }
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role, isApproved: user.isApproved };
}

async function forgotPassword({ email }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+resetToken +resetTokenExpiry");
  // Always respond with success to prevent email enumeration
  if (!user) return { message: "If that email exists, a reset link has been sent." };

  // Generate a secure random token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl });

  return { message: "If that email exists, a reset link has been sent." };
}

async function resetPassword({ token, password }) {
  if (!token) {
    const err = new Error("Reset token is required");
    err.status = 400;
    throw err;
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: new Date() },
  }).select("+password +resetToken +resetTokenExpiry");

  if (!user) {
    const err = new Error("Reset token is invalid or has expired");
    err.status = 400;
    throw err;
  }

  user.password = await hashPassword(password);
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save({ validateBeforeSave: false });

  return { message: "Password updated successfully. You can now sign in." };
}

module.exports = { register, login, me, forgotPassword, resetPassword };
