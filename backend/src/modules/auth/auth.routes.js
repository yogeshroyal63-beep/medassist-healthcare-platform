const express = require("express");

const validate = require("../../middleware/validate.middleware");
const auth = require("../../middleware/auth.middleware");
const authValidator = require("./auth.validator");
const authController = require("./auth.controller");

const router = express.Router();

router.post("/register", validate(authValidator.register), authController.register);
router.post("/login", validate(authValidator.login), authController.login);
router.get("/me", auth, authController.me);

module.exports = router;

