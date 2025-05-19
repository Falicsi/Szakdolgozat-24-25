const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const router = express.Router();

// Feltöltött képek mappája
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer storage beállítás
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // Egyedi fájlnév
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  // Az URL-t a frontend így éri el:
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;