import { Controller, Get, NotFoundException, Param, Res, StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('files')
export class FilesController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  async get(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const file = await this.prisma.storedFile.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('File not found');

    res.set({
      'Content-Type': file.mimeType,
      'Content-Length': String(file.data.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    });
    return new StreamableFile(Buffer.from(file.data));
  }
}
