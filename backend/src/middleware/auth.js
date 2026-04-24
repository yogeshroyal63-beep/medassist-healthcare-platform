const jwt = require("jsonwebtoken");
const { jwtAccessSecret } = require("../config/env");
const { User } = require("../modules/models");

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, jwtAccessSecret);
    const user = await User.findById(decoded.sub).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  return next();
};

module.exports = { requireAuth, authorize };
