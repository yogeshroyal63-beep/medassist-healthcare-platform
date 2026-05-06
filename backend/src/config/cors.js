module.exports = function corsOptions() {
  return {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4173",
      "http://localhost:80",
      "http://localhost",
      process.env.FRONTEND_URL || "http://localhost:5173"
    ],
    credentials: true,
  };
};

