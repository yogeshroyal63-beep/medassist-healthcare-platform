const mongoose = require("mongoose");
const { hashPassword, comparePassword } = require("../../utils/bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
    isApproved: { type: Boolean, default: true },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    resetToken: { type: String, default: null, select: false },
    resetTokenExpiry: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function preSave(next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  return next();
});

userSchema.methods.comparePassword = async function compare(pw) {
  return comparePassword(pw, this.password);
};

module.exports = mongoose.model("User", userSchema);
