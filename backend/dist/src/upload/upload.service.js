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
const fs = require("fs");
const path = require("path");
const crypto_1 = require("crypto");
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024;
let UploadService = class UploadService {
    constructor(config) {
        this.config = config;
        this.driver = this.config.get('UPLOAD_DRIVER', 'local');
        this.localPath = this.config.get('UPLOAD_LOCAL_PATH', './uploads');
    }
    async saveFile(file, folder) {
        if (!file || !file.mimetype)
            throw new common_1.BadRequestException('No file');
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
        }
        const maxSize = Number(this.config.get('UPLOAD_MAX_SIZE', MAX_SIZE));
        if (file.size > maxSize)
            throw new common_1.BadRequestException('File too large');
        if (this.driver === 'local') {
            return this.saveLocal(file, folder);
        }
        throw new common_1.BadRequestException('S3 upload not configured. Use UPLOAD_DRIVER=local');
    }
    async saveLocal(file, folder) {
        const dir = path.join(this.localPath, folder);
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        const ext = path.extname(file.originalname) || '.jpg';
        const filename = `${(0, crypto_1.randomUUID)()}${ext}`;
        const filepath = path.join(dir, filename);
        fs.writeFileSync(filepath, file.buffer);
        return `/uploads/${folder}/${filename}`;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map