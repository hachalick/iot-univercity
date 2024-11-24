import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ParkingEntity } from '../entity/mysql/Parking.entity';
import { HistoryParkingEntity } from '../entity/mysql/History_Parking.entity';

@Injectable()
export class TypeOrmDbConfig implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      port: this.configService.get('Db.port'),
      host: this.configService.get('Db.host'),
      username: this.configService.get('Db.username'),
      password: this.configService.get('Db.password'),
      database: this.configService.get('Db.database'),
      synchronize: true,
      entities: [ParkingEntity, HistoryParkingEntity],
    };
  }
}
