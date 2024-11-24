import { Module } from '@nestjs/common';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { SensorGateway } from './sensor.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryParkingEntity } from 'src/modules/entity/mysql/History_Parking.entity';
import { ParkingEntity } from 'src/modules/entity/mysql/Parking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryParkingEntity, ParkingEntity])],
  controllers: [SensorController],
  providers: [SensorService, SensorGateway],
})
export class SensorModule {}
