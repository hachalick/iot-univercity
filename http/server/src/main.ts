import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { callBackListener } from './modules/utils/callBack.main';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { configSwagger } from './modules/config/swaagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });
  app.enableCors({ origin: '*' });
  app.useStaticAssets(join(process.cwd(), 'public'));
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/swagger', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080, () => callBackListener(8080));
}
bootstrap();
