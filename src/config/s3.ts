// src/config/s3.ts
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
dotenv.config();

// Create a v3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export const upload = multer({
  storage: multerS3({
    s3,                              // <-- v3 S3Client here
    bucket: process.env.S3_BUCKET_NAME!,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: (err: Error | null, key?: string) => void
    ) => {
      const filename = `products/${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});
