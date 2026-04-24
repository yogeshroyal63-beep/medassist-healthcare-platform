const express = require("express");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const { requireAuth, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { signAccessToken, signRefreshToken } = require("../utils/tokens");
const { aiServiceUrl, jwtRefreshSecret } = require("../config/env");
const {
  User,
  DoctorProfile,
  Appointment,
  Medication,
  HealthRecord,
  Message,
  Conversation,
  TriageLog,
  AuditLog
} = require("./models");

const router = express.Router();

const createAudit = async (actor, action, target) => {
  if (!actor) return;
  await AuditLog.create({ actor, action, target });
};

router.post(
  "/auth/register",
  body("fullName").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("role").isIn(["PATIENT", "DOCTOR"]),
  validate,
  async (req, res) => {
    const { fullName, email, password, role, ...rest } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const user = await User.create({ fullName, email, password, role, ...rest });
    if (role === "DOCTOR") {
      await DoctorProfile.create({
        user: user._id,
        specialty: rest.specialty || "General",
        licenseNumber: rest.licenseNumber || `TEMP-${Date.now()}`,
        location: rest.location || ""
      });
    }
    return res.status(201).json({ message: "Registered successfully" });
  }
);

router.post("/auth/login", body("email").isEmail(), body("password").notEmpty(), validate, async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });
  if (user.role === "DOCTOR") {
    const profile = await DoctorProfile.findOne({ user: user._id });
    if (profile?.verificationStatus !== "APPROVED") {
      return res.status(403).json({ message: "Doctor account pending admin approval" });
    }
  }
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  return res.json({ accessToken, refreshToken, user: { id: user._id, role: user.role, fullName: user.fullName, email: user.email } });
});

router.post("/auth/logout", requireAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  return res.json({ message: "Logged out" });
});

router.post("/auth/refresh-token", body("refreshToken").notEmpty(), validate, async (req, res) => {
  const user = await User.findOne({ refreshToken: req.body.refreshToken });
  if (!user) return res.status(401).json({ message: "Invalid refresh token" });
  try {
    jwt.verify(req.body.refreshToken, jwtRefreshSecret);
  } catch {
    return res.status(401).json({ message: "Expired or invalid refresh token" });
  }
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  return res.json({ accessToken, refreshToken });
});

router.get("/users/me", requireAuth, async (req, res) => res.json(req.user));
router.put("/users/profile", requireAuth, async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select("-password");
  return res.json(updated);
});
router.put("/users/settings", requireAuth, async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.user._id, { settings: req.body }, { new: true }).select("-password");
  return res.json(updated);
});

router.get("/doctors", requireAuth, async (req, res) => {
  const { specialty, location } = req.query;
  const profileFilter = { verificationStatus: "APPROVED" };
  if (specialty) profileFilter.specialty = new RegExp(specialty, "i");
  if (location) profileFilter.location = new RegExp(location, "i");
  const profiles = await DoctorProfile.find(profileFilter).populate("user", "fullName email");
  return res.json(profiles);
});
router.get("/doctors/:id", requireAuth, async (req, res) => {
  const profile = await DoctorProfile.findOne({ user: req.params.id }).populate("user", "fullName email phone");
  return res.json(profile);
});
router.put("/doctors/availability", requireAuth, authorize("DOCTOR"), async (req, res) => {
  const profile = await DoctorProfile.findOneAndUpdate({ user: req.user._id }, { availability: req.body.availability || [] }, { new: true });
  return res.json(profile);
});
router.get("/doctors/dashboard/stats", requireAuth, authorize("DOCTOR"), async (req, res) => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const [todayCount, total, pending, completed] = await Promise.all([
    Appointment.countDocuments({ doctor: req.user._id, date: today }),
    Appointment.countDocuments({ doctor: req.user._id }),
    Appointment.countDocuments({ doctor: req.user._id, status: "PENDING" }),
    Appointment.countDocuments({ doctor: req.user._id, status: "COMPLETED" })
  ]);
  return res.json({ todayPatients: todayCount, totalAppointments: total, pending, revenue: completed * 700 });
});

router.post("/appointments/book", requireAuth, authorize("PATIENT"), async (req, res) => {
  const appointment = await Appointment.create({ ...req.body, patient: req.user._id, status: "PENDING" });
  await createAudit(req.user._id, "BOOK_APPOINTMENT", String(appointment._id));
  return res.status(201).json(appointment);
});
router.get("/appointments/patient/:id", requireAuth, async (req, res) => {
  const data = await Appointment.find({ patient: req.params.id }).populate("doctor", "fullName");
  return res.json(data);
});
router.get("/appointments/doctor/:id", requireAuth, async (req, res) => {
  const data = await Appointment.find({ doctor: req.params.id }).populate("patient", "fullName");
  return res.json(data);
});
router.put("/appointments/:id/status", requireAuth, authorize("DOCTOR", "ADMIN"), async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  return res.json(appointment);
});

router.get("/medications/:patientId", requireAuth, async (req, res) => res.json(await Medication.find({ patient: req.params.patientId })));
router.post("/medications", requireAuth, authorize("DOCTOR", "ADMIN"), async (req, res) => res.status(201).json(await Medication.create(req.body)));
router.put("/medications/:id", requireAuth, authorize("DOCTOR", "ADMIN"), async (req, res) =>
  res.json(await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);
router.post("/medications/reminders", requireAuth, async (req, res) =>
  res.json(await Medication.findByIdAndUpdate(req.body.medicationId, { reminders: req.body.reminders || [] }, { new: true }))
);

router.get("/records/:patientId", requireAuth, async (req, res) => res.json(await HealthRecord.find({ patient: req.params.patientId })));
router.post("/records/upload", requireAuth, async (req, res) => res.status(201).json(await HealthRecord.create(req.body)));
router.delete("/records/:id", requireAuth, async (req, res) => {
  await HealthRecord.findByIdAndDelete(req.params.id);
  return res.json({ message: "Record deleted" });
});

router.post("/triage/check", requireAuth, authorize("PATIENT"), async (req, res) => {
  const inputSymptoms = req.body.symptoms;
  const symptomsText = Array.isArray(inputSymptoms)
    ? inputSymptoms.join(", ")
    : String(inputSymptoms || "").trim();

  if (!symptomsText) return res.status(400).json({ message: "Symptoms are required" });

  let normalized;
  try {
    const triageResponse = await axios.post(
      `${aiServiceUrl}/triage`,
      { symptoms: symptomsText, age: req.body.age ?? null },
      { timeout: 10000 }
    );

    const ai = triageResponse.data || {};
    normalized = {
      severity: ai.severity || "Medium",
      insights: [
        ai.top_condition ? `Possible condition: ${ai.top_condition}` : null,
        ai.specialty?.primary ? `Suggested specialty: ${ai.specialty.primary}` : null,
        ai.intent_note || null
      ].filter(Boolean),
      recommendation:
        ai.advice?.action ||
        (ai.severity === "Critical" || ai.severity === "Emergency"
          ? "Emergency"
          : ai.severity === "High"
            ? "See doctor"
            : "Monitor at home"),
      raw: ai,
      degraded: false
    };
  } catch {
    normalized = {
      severity: "Medium",
      insights: [
        "AI triage service is currently unavailable.",
        "Please consult a doctor if symptoms persist or worsen."
      ],
      recommendation: "See doctor",
      raw: null,
      degraded: true
    };
  }

  await TriageLog.create({
    patient: req.user._id,
    symptoms: symptomsText.split(",").map((s) => s.trim()).filter(Boolean),
    result: normalized
  });

  return res.json(normalized);
});

router.get("/messages/:conversationId", requireAuth, async (req, res) => {
  const messages = await Message.find({ conversation: req.params.conversationId }).sort({ createdAt: 1 });
  return res.json(messages);
});
router.post("/messages/send", requireAuth, async (req, res) => {
  const { receiver, content } = req.body;
  const participants = [String(req.user._id), String(receiver)].sort();
  let conversation = await Conversation.findOne({ participants: { $all: participants, $size: 2 } });
  if (!conversation) conversation = await Conversation.create({ participants });
  const message = await Message.create({ sender: req.user._id, receiver, conversation: conversation._id, content });
  conversation.lastMessage = content;
  await conversation.save();
  return res.status(201).json({ conversationId: conversation._id, message });
});

router.get("/admin/stats", requireAuth, authorize("ADMIN"), async (req, res) => {
  const [totalUsers, totalDoctors, totalAppointments] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "DOCTOR" }),
    Appointment.countDocuments()
  ]);
  return res.json({ totalUsers, totalDoctors, totalAppointments });
});
router.get("/admin/doctors/pending", requireAuth, authorize("ADMIN"), async (req, res) =>
  res.json(await DoctorProfile.find({ verificationStatus: "PENDING" }).populate("user", "fullName email"))
);
router.put("/admin/doctors/:id/approve", requireAuth, authorize("ADMIN"), async (req, res) => {
  const profile = await DoctorProfile.findByIdAndUpdate(req.params.id, { verificationStatus: "APPROVED" }, { new: true });
  await createAudit(req.user._id, "APPROVE_DOCTOR", String(profile._id));
  return res.json(profile);
});
router.put("/admin/doctors/:id/reject", requireAuth, authorize("ADMIN"), async (req, res) => {
  const profile = await DoctorProfile.findByIdAndUpdate(req.params.id, { verificationStatus: "REJECTED", rejectionNote: req.body.note || "" }, { new: true });
  await createAudit(req.user._id, "REJECT_DOCTOR", String(profile._id));
  return res.json(profile);
});
router.get("/admin/audit-logs", requireAuth, authorize("ADMIN"), async (req, res) =>
  res.json(await AuditLog.find().populate("actor", "fullName role").sort({ createdAt: -1 }).limit(200))
);

module.exports = router;
