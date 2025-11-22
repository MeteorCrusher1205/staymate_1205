const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createFlat,
  getAllFlats,
  getFlatsByOwner,
  deleteFlat,
} = require("../controllers/flatController");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .jpg, .jpeg, and .png files allowed!"));
  },
});

// Routes
router.post("/", (req, res, next) => {
  upload.array("Flat-images", 10)(req, res, function (err) {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, createFlat);

router.get("/all-details", getAllFlats);
router.get("/owner/:ownerId", getFlatsByOwner);
router.delete("/delete/:flatId", deleteFlat);

module.exports = router;
