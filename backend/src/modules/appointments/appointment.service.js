const Appointment = require("./appointment.model");
const Doctor = require("../doctors/doctor.model");

async function book(user, body) {
  const appointment = await Appointment.create({
    patientId: user.id,
    doctorId: body.doctorId,
    date: body.date,
    time: body.time,
    type: body.type || "in-person",
    status: "pending",
    reason: body.reason || "",
    notes: body.notes || "",
  });

  // Mongoose 8: populate after create using findById
  return Appointment.findById(appointment._id)
    .populate("patientId", "name email")
    .populate({ path: "doctorId", populate: { path: "userId", select: "name email" } });
}

async function myAppointments(user) {
  const role = user.role;
  if (role === "patient") {
    return Appointment.find({ patientId: user.id })
      .sort({ createdAt: -1 })
      .populate({ path: "doctorId", populate: { path: "userId", select: "name email" } });
  }
  if (role === "doctor") {
    const doctor = await Doctor.findOne({ userId: user.id });
    if (!doctor) {
      const err = new Error("Doctor profile not found");
      err.status = 404;
      throw err;
    }
    return Appointment.find({ doctorId: doctor._id })
      .sort({ createdAt: -1 })
      .populate("patientId", "name email");
  }
  // admin can see all (used in audit logs)
  return Appointment.find({}).sort({ createdAt: -1 }).limit(200).populate("patientId", "name email");
}

async function updateStatus(id, status) {
  return Appointment.findByIdAndUpdate(id, { status }, { new: true })
    .populate("patientId", "name email")
    .populate({ path: "doctorId", populate: { path: "userId", select: "name email" } });
}

async function cancel(user, id) {
  const appt = await Appointment.findOne({ _id: id, patientId: user.id });
  if (!appt) {
    const err = new Error("Appointment not found");
    err.status = 404;
    throw err;
  }
  appt.status = "cancelled";
  await appt.save();
  return appt;
}

module.exports = { book, myAppointments, updateStatus, cancel };

