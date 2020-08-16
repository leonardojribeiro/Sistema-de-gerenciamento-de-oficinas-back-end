import { FileFilterCallback } from "multer";
import multer from "multer";
import { Request } from "express";


export default {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024
  },
  fileFilter: (req: Request, file: any, cb: FileFilterCallback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
      "image/jpg",
      "image/*"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
};
