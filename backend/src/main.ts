import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true, 
  }));

//  const baseUploadPath = '/app/uploads';
//   ['documents', 'signatures'].forEach((folder) => {
//     const path = `${baseUploadPath}/${folder}`;
//     if (!existsSync(path)) {
//       mkdirSync(path, { recursive: true });
//       console.log(`Created folder: ${path}`);
//     }
//   });

   app.enableCors({ origin: '*' });
const port = process.env.PORT ?? 3000;
await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

}
bootstrap();
