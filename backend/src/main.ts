import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isProduction = process.env.NODE_ENV === 'production';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(helmet());
  app.use(morgan(isProduction ? 'combined' : 'dev'));

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser requests (like server-to-server/health checks)
      if (!origin) return callback(null, true);

      if (isProduction) {
        return callback(origin === frontendUrl ? null : new Error('Not allowed by CORS'), origin === frontendUrl);
      }

      // In local development, allow localhost on any port (Vite may choose 5173/5174/5175...)
      const isLocalhost = /^https?:\/\/localhost:\d+$/.test(origin);
      const allowed = isLocalhost || origin === frontendUrl;
      return callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
    },
    credentials: true,
  });

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`🚀 Server is running on port ${PORT}`);
}
bootstrap();

