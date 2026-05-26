import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class UploadService {
  private driver: string;
  private localPath: string;

  constructor(private config: ConfigService) {
    this.driver = this.config.get<string>('UPLOAD_DRIVER', 'local');
    this.localPath = this.config.get<string>('UPLOAD_LOCAL_PATH', './uploads');
  }

  async saveFile(
    file: Express.Multer.File,
    folder: 'logos' | 'covers' | 'products',
  ): Promise<string> {
    if (!file || !file.mimetype) throw new BadRequestException('No file');
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
    }
    const maxSize = Number(this.config.get('UPLOAD_MAX_SIZE', MAX_SIZE));
    if (file.size > maxSize) throw new BadRequestException('File too large');

    if (this.driver === 'local') {
      return this.saveLocal(file, folder);
    }
    // S3: return signed URL or upload and return public URL
    throw new BadRequestException('S3 upload not configured. Use UPLOAD_DRIVER=local');
  }

  private async saveLocal(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    const dir = path.join(this.localPath, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${randomUUID()}${ext}`;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, file.buffer);
    // Return path relative to public URL (e.g. /uploads/products/xxx.jpg)
    return `/uploads/${folder}/${filename}`;
  }
}
