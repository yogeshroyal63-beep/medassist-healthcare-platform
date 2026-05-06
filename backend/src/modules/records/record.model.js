const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["lab", "prescription", "imaging", "diagnosis", "vaccination", "other"],
      required: true,
    },
    description: { type: String, default: "" },
    date: { type: String, required: true },
    doctorName: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", recordSchema);

