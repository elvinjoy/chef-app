// multerConfig.js
const multer = require('multer');
const path = require('path');

// Configure where files will be stored and how they will be named
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination folder for the uploaded images
    cb(null, 'uploads/'); // Upload folder
  },
  filename: (req, file, cb) => {
    // Specify how the file will be named (use original name or generate a unique one)
    cb(null, Date.now() + path.extname(file.originalname)); // Add a timestamp to avoid name conflicts
  }
});

// File filter: validate file type (images only)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type, only JPG, JPEG, and PNG are allowed'), false); // Reject file
  }
};

// Set file size limit (e.g., 5MB max per file)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});

// Add error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
};

module.exports = { upload, handleMulterError };