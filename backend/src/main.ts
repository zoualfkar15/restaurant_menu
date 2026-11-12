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

  const allowedOrigins = [process.env.CORS_ORIGIN, process.env.FRONTEND_URL, 'http://localhost:3000']
    .filter(Boolean)
    .flatMap((value) => value!.split(','))
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    allowedOrigins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }
  const allowVercelPreviews = process.env.CORS_ALLOW_VERCEL_PREVIEWS === 'true';

  const originAllowed = (origin: string) => {
    const normalized = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalized) || allowedOrigins.includes('*')) return true;
    try {
      const host = new URL(normalized).hostname;
      if (host.endsWith('.onrender.com')) return true;
      if (host.endsWith('.pages.dev')) return true;
      if (allowVercelPreviews && host.endsWith('.vercel.app')) return true;
    } catch {
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
