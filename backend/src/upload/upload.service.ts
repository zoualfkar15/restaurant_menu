import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class UploadService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async saveFile(
    file: Express.Multer.File,
    folder: 'logos' | 'covers' | 'products',
  ): Promise<string> {
    if (!file || !file.mimetype || !file.buffer) throw new BadRequestException('No file');
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
    }
    const maxSize = Number(this.config.get('UPLOAD_MAX_SIZE', MAX_SIZE));
    if (file.size > maxSize) throw new BadRequestException('File too large');

    const stored = await this.prisma.storedFile.create({
      data: {
        folder,
        mimeType: file.mimetype,
        data: Uint8Array.from(file.buffer),
      },
    });
    return `/api/files/${stored.id}`;
  }
}
