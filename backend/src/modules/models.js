const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["PATIENT", "DOCTOR", "ADMIN"], default: "PATIENT" },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    medicalProfile: {
      bloodGroup: String,
      allergies: [String],
      chronicConditions: [String]
    },
    refreshToken: { type: String, default: null },
    settings: {
      notifications: { type: Boolean, default: true },
      theme: { type: String, default: "light" }
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function preSave() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const doctorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialty: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    experienceYears: { type: Number, default: 0 },
    location: { type: String, default: "" },
    consultationFee: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    verificationStatus: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    availability: [{ day: String, slots: [String] }]
  },
  { timestamps: true }
);

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"], default: "PENDING" },
    type: { type: String, enum: ["IN_PERSON", "VIDEO"], default: "VIDEO" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

const medicationSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    drugName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    reminders: [{ time: String, enabled: { type: Boolean, default: true } }]
  },
  { timestamps: true }
);

const healthRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String, default: "" }
  },
  { timestamps: true }
);

const triageLogSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symptoms: [{ type: String, required: true }],
    result: { type: Object, required: true }
  },
  { timestamps: true }
);

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    target: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const DoctorProfile = mongoose.model("DoctorProfile", doctorProfileSchema);
const Appointment = mongoose.model("Appointment", appointmentSchema);
const Medication = mongoose.model("Medication", medicationSchema);
const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);
const Message = mongoose.model("Message", messageSchema);
const Conversation = mongoose.model("Conversation", conversationSchema);
const TriageLog = mongoose.model("TriageLog", triageLogSchema);
const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = {
  User,
  DoctorProfile,
  Appointment,
  Medication,
  HealthRecord,
  Message,
  Conversation,
  TriageLog,
  AuditLog
};
