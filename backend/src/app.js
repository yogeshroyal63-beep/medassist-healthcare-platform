const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const corsOptions = require("./config/cors");
const rateLimit = require("./middleware/rateLimit.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const doctorRoutes = require("./modules/doctors/doctor.routes");
const appointmentRoutes = require("./modules/appointments/appointment.routes");
const medicationRoutes = require("./modules/medications/medication.routes");
const recordRoutes = require("./modules/records/record.routes");
const triageRoutes = require("./modules/triage/triage.routes");
const messageRoutes = require("./modules/messaging/message.routes");
const videoRoutes = require("./modules/video/video.routes");
const adminRoutes = require("./modules/admin/admin.routes");

const app = express();

app.use(cors(corsOptions()));
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api", rateLimit);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/triage", triageRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorMiddleware);

module.exports = app;
