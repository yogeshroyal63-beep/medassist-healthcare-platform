const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const routes = require("./modules/routes");
const { frontendUrl } = require("./config/env");

const app = express();

app.use(
  cors({
    origin: frontendUrl,
    credentials: true
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: true
  })
);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", routes);

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || err.statusCode || 500;
  const message = status < 500 && err.message ? err.message : "Internal server error";
  res.status(status).json({ message });
});

module.exports = app;
