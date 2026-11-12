import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare class FilesController {
    private prisma;
    constructor(prisma: PrismaService);
    get(id: string, res: Response): Promise<StreamableFile>;
}
