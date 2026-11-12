"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const spa_fallback_filter_1 = require("./spa-fallback.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), { prefix: '/uploads/' });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const allowedOrigins = [process.env.CORS_ORIGIN, process.env.FRONTEND_URL, 'http://localhost:3000']
        .filter(Boolean)
        .flatMap((value) => value.split(','))
        .map((origin) => origin.trim().replace(/\/$/, ''))
        .filter(Boolean);
    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
        allowedOrigins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
    }
    const allowVercelPreviews = process.env.CORS_ALLOW_VERCEL_PREVIEWS === 'true';
    const originAllowed = (origin) => {
        const normalized = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(normalized) || allowedOrigins.includes('*'))
            return true;
        try {
            const host = new URL(normalized).hostname;
            if (host.endsWith('.onrender.com'))
                return true;
            if (host.endsWith('.pages.dev'))
                return true;
            if (allowVercelPreviews && host.endsWith('.vercel.app'))
                return true;
        }
        catch {
            return false;
        }
        return false;
    };
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || originAllowed(origin)) {
                callback(null, true);
                return;
            }
            callback(null, false);
        },
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    const clientDir = process.env.CLIENT_DIR || (0, path_1.join)(process.cwd(), 'public');
    if ((0, fs_1.existsSync)((0, path_1.join)(clientDir, 'index.html'))) {
        app.useStaticAssets(clientDir);
        app.useGlobalFilters(new spa_fallback_filter_1.SpaFallbackFilter(clientDir));
    }
    const port = Number(process.env.PORT) || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`MenuQR API running on http://0.0.0.0:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map