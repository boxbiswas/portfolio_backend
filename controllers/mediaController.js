import { prisma } from '../lib/prisma.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('file'); // 'file' is the field name from the frontend

export const uploadMedia = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: 'File upload failed', error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file provided' });
      }

      // Generate local URL (ensure your Express app serves the /uploads static folder)
      const fileUrl = `/uploads/${req.file.filename}`;

      const media = await prisma.media.create({
        data: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          storageKey: req.file.filename, // For cloud storage, this would be the S3/Cloudinary key
          url: fileUrl,
          mimeType: req.file.mimetype,
          sizeBytes: req.file.size
        }
      });

      return res.status(201).json({ success: true, message: 'Media uploaded', data: media });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  });
};

export const getMedia = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.media.count()
    ]);

    return res.status(200).json({
      success: true,
      message: 'Media retrieved',
      data: media,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });
    
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, '../uploads', media.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await prisma.media.delete({ where: { id: req.params.id } });

    return res.status(200).json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
