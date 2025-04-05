import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadRouter = express.Router();

// 🔹 Cấu hình multer để lưu video vào thư mục "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file
  },
});

const upload = multer({ storage: storage });

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// API upload video
uploadRouter.post(
  "/upload",
  upload.single("video"),
  async (req: MulterRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "Vui lòng tải lên một file video!" });
        return;
      }

      // Tạo URL video
      const videoUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      res.json({ message: "Tải video thành công!", videoUrl });
    } catch (error) {
      console.error("Lỗi khi tải video:", error);
      res.status(500).json({ error: "Có lỗi xảy ra khi tải video!" });
    }
  }
);

export default uploadRouter;
