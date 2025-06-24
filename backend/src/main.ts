// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS config to allow frontend requests
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend origin
    credentials: true,
  });

  // Listen on backend port (default to 4000)
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
