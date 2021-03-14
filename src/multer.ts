import crypto from 'crypto';
import path from 'path';
import { FileFilterCallback, MulterError } from "multer";
import multer, { Multer } from "multer";
import { Request } from "express";

type StorageTypesENV = "local" | "googleStorage"

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "images", "uploads"));
    },
    filename: (req, file, cb) => {
      file.filename = `${crypto.randomBytes(16).toString("hex")}.${file.mimetype.split("/")[1]}`;
      cb(null, file.filename);
    }
  }),
  googleStorage: multer.memoryStorage()
}

export default {
  dest: path.resolve(__dirname, "..", "images", "uploads"),
  storage: storageTypes[process.env.STORAGE_TYPE as StorageTypesENV],
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
