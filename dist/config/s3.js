"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// src/config/s3.ts
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create a v3 client
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3, // <-- v3 S3Client here
        bucket: process.env.S3_BUCKET_NAME,
        // acl: 'public-read',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const filename = `products/${Date.now()}-${file.originalname}`;
            cb(null, filename);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});
