const dotenv = require("dotenv");

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";

function requiredEnv(name, fallback = null) {
  const envValue = process.env[name];
  if (envValue) return envValue;
  if (nodeEnv === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return fallback;
}

module.exports = {
  nodeEnv,
  port: Number(process.env.PORT || 5000),
  mongoUri: requiredEnv("MONGO_URI", "mongodb://localhost:27017/medassist"),
  jwtSecret: requiredEnv("JWT_SECRET", "medassist_jwt_secret_change_in_production"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  aiServiceUrl: requiredEnv("AI_SERVICE_URL", "http://localhost:8000"),
  adminEmail: process.env.ADMIN_EMAIL || null,
  adminPassword: process.env.ADMIN_PASSWORD || null,
  jwtAccessSecret: requiredEnv("JWT_ACCESS_SECRET", "medassist_access_secret"),
  jwtRefreshSecret: requiredEnv("JWT_REFRESH_SECRET", "medassist_refresh_secret"),
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173"
};
