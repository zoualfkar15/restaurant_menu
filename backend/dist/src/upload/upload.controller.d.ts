import { UploadService } from './upload.service';
export declare class UploadController {
    private uploadService;
    constructor(uploadService: UploadService);
    upload(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadLogo(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadCover(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
