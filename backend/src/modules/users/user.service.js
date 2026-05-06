const mongoose = require("mongoose");
const User = require("../auth/auth.model");
const UserProfile = require("./user.model");

async function getMe(user) {
  if (user?.id === "admin") {
    return { user: { id: "admin", name: "Admin", email: user.email, role: "admin", isApproved: true }, profile: null };
  }

  const dbUser = await User.findById(user.id);
  if (!dbUser) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  const profile = await UserProfile.findOne({ userId: dbUser._id });
  return {
    user: { id: dbUser._id.toString(), name: dbUser.name, email: dbUser.email, role: dbUser.role, isApproved: dbUser.isApproved },
    profile,
  };
}

async function updateMe(user, body) {
  if (user?.id === "admin") {
    const err = new Error("Admin profile updates are not supported");
    err.status = 400;
    throw err;
  }

  const allowed = {};
  if (typeof body.name === "string") allowed.name = body.name;
  if (typeof body.phone === "string") allowed.phone = body.phone;

  if (typeof body.role === "string") {
    if (!["patient", "doctor"].includes(body.role)) {
      const err = new Error("Invalid role");
      err.status = 400;
      throw err;
    }
    allowed.role = body.role;
    allowed.isApproved = body.role === "doctor" ? false : true;
  }

  const updatedUser = await User.findByIdAndUpdate(user.id, allowed, { new: true });
  if (!updatedUser) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  const profileAllowed = {};
  for (const k of ["age", "gender", "bloodGroup", "address"]) {
    if (body[k] !== undefined) profileAllowed[k] = body[k];
  }
  if (body.allergies !== undefined) {
    if (!Array.isArray(body.allergies)) {
      const err = new Error("allergies must be an array");
      err.status = 400;
      throw err;
    }
    profileAllowed.allergies = body.allergies;
  }
  if (body.chronicConds !== undefined) {
    if (!Array.isArray(body.chronicConds)) {
      const err = new Error("chronicConds must be an array");
      err.status = 400;
      throw err;
    }
    profileAllowed.chronicConds = body.chronicConds;
  }
  if (body.emergencyContact !== undefined) {
    profileAllowed.emergencyContact = body.emergencyContact;
  }
  if (body.phone !== undefined) {
    profileAllowed.phone = body.phone;
  }

  const profile = await UserProfile.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(user.id) },
    { $set: profileAllowed, $setOnInsert: { userId: new mongoose.Types.ObjectId(user.id) } },
    { upsert: true, new: true }
  );

  return {
    user: {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isApproved: updatedUser.isApproved,
    },
    profile,
  };
}

module.exports = { getMe, updateMe };

