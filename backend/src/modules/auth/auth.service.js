const User = require("./auth.model");
const { signToken } = require("../../utils/jwt");
const { adminEmail, adminPassword } = require("../../config/env");

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

module.exports = { register, login, me };

