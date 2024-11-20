import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { SensorGateway } from './sensor.gateway';

@Module({
  controllers: [SensorController],
  providers: [SensorService, SensorGateway]
})
export class SensorModule {}
