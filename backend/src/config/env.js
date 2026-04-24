const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medassist",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "medassist_access_secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "medassist_refresh_secret",
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:8000"
};
