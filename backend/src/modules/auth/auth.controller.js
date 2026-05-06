const authService = require("./auth.service");

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

async function me(req, res, next) {
  try {
    const result = await authService.me(req.user.id);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const result = await authService.forgotPassword(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

async function resetPassword(req, res, next) {
  try {
    const result = await authService.resetPassword(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

module.exports = { register, login, me, forgotPassword, resetPassword };
