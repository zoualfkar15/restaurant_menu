"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024;
let UploadService = class UploadService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
    }
    async saveFile(file, folder) {
        if (!file || !file.mimetype || !file.buffer)
            throw new common_1.BadRequestException('No file');
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
        }
        const maxSize = Number(this.config.get('UPLOAD_MAX_SIZE', MAX_SIZE));
        if (file.size > maxSize)
            throw new common_1.BadRequestException('File too large');
        const stored = await this.prisma.storedFile.create({
            data: {
                folder,
                mimeType: file.mimetype,
                data: Uint8Array.from(file.buffer),
            },
        });
        return `/api/files/${stored.id}`;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map