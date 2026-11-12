import { existsSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { SpaFallbackFilter } from './spa-fallback.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    allowedOrigins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }
  const allowVercelPreviews = process.env.CORS_ALLOW_VERCEL_PREVIEWS === 'true';

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
        return;
      }
      if (allowVercelPreviews) {
        try {
          if (new URL(origin).hostname.endsWith('.vercel.app')) {
            callback(null, true);
            return;
          }
        } catch {
          /* ignore invalid Origin */
        }
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  });

  const clientDir = process.env.CLIENT_DIR || join(process.cwd(), 'public');
  if (existsSync(join(clientDir, 'index.html'))) {
    app.useStaticAssets(clientDir);
    app.useGlobalFilters(new SpaFallbackFilter(clientDir));
  }

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`MenuQR API running on http://0.0.0.0:${port}/api`);
}

bootstrap();
