import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import morgan from 'morgan';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

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

  const corsOrigin: CorsOptions['origin'] = (origin, callback) => {
    // Allow non-browser requests (like server-to-server/health checks)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (isProduction) {
      callback(
        origin === frontendUrl ? null : new Error('Not allowed by CORS'),
        origin === frontendUrl,
      );
      return;
    }

    // In local development, allow localhost on any port (Vite may choose 5173/5174/5175...)
    const isLocalhost = /^https?:\/\/localhost:\d+$/.test(origin);
    const allowed = isLocalhost || origin === frontendUrl;
    callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
  };

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  const environment = process.env.NODE_ENV || 'development';
  const port = Number(process.env.PORT || 4000);

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend running in ${environment}:${port}`);
  console.log(`🔎 GraphQL endpoint: http://localhost:${port}/graphql`);
  console.log(`❤️ Health endpoint: http://localhost:${port}/health`);
}
void bootstrap();
