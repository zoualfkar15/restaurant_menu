import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private config;
    private driver;
    private localPath;
    constructor(config: ConfigService);
    saveFile(file: Express.Multer.File, folder: 'logos' | 'covers' | 'products'): Promise<string>;
    private saveLocal;
}
