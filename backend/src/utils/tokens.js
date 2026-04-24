const jwt = require("jsonwebtoken");
const { jwtAccessSecret, jwtRefreshSecret, accessTokenTtl, refreshTokenTtl } = require("../config/env");

const signAccessToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role, email: user.email }, jwtAccessSecret, { expiresIn: accessTokenTtl });

const signRefreshToken = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, jwtRefreshSecret, { expiresIn: refreshTokenTtl });

module.exports = { signAccessToken, signRefreshToken };
