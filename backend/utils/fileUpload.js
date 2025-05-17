const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists and has proper permissions
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  fs.chmodSync(uploadsDir, 0o755);
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName).toLowerCase();
    const name = path.basename(originalName, extension);
    cb(null, `${timestamp}-${name}${extension}`);
  }
});

// File size limits (10MB)
const maxSize = 10 * 1024 * 1024; // 10MB

const upload = multer({
  storage,
  limits: {
    fileSize: maxSize
  },
  fileFilter: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, XLSX, and XLS files are allowed'));
    }
  },
  onError: (err, next) => {
    console.error('Multer error:', err);
    next(err);
  }
});

module.exports = upload;