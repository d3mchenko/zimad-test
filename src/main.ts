import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: "*", allowedHeaders: "*" });

  const PORT = process.env.PORT;
  await app.listen(PORT, () => {
    console.log(`Server started on ${PORT} port`);
  });
}
bootstrap();
