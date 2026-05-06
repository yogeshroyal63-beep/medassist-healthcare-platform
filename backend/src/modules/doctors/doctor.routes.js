const express = require("express");
const multer = require("multer");
const path = require("path");

const auth = require("../../middleware/auth.middleware");
const role = require("../../middleware/role.middleware");
const doctorController = require("./doctor.controller");

const uploadDir = path.join(process.cwd(), "uploads");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get("/", doctorController.list); // public list approved doctors

router.get("/me", auth, role("doctor"), doctorController.me);
router.get("/:id", doctorController.getOne); // public doctor profile

router.post(
  "/register",
  auth,
  role("doctor"),
  upload.fields([
    { name: "license", maxCount: 1 },
    { name: "governmentId", maxCount: 1 },
  ]),
  doctorController.register
);

router.patch("/availability", auth, role("doctor"), doctorController.availability);

module.exports = router;

