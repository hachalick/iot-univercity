import { DocumentBuilder } from '@nestjs/swagger';

export const configSwagger = new DocumentBuilder()
  .setTitle('server choconan')
  .setDescription('description')
  .setVersion('0.0.1')
  .build();
