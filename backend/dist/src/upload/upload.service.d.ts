import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class UploadService {
    private config;
    private prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    saveFile(file: Express.Multer.File, folder: 'logos' | 'covers' | 'products'): Promise<string>;
}
