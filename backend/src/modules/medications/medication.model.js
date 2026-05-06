const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    times: [{ type: String }],
    startDate: { type: String, required: true },
    endDate: { type: String, default: "" },
    instructions: { type: String, default: "" },
    prescribedBy: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    takenToday: { type: Boolean, default: false },
    lastTakenDate: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medication", medicationSchema);

