const { verifyToken } = require("../utils/jwt");

module.exports = function authMiddleware(req, _res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");
  if (!token) {
    const err = new Error("Unauthorized");
    err.status = 401;
    return next(err);
  }
  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (e) {
    const err = new Error("Unauthorized");
    err.status = 401;
    return next(err);
  }
};

