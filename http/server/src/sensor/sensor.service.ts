import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { HistoryParkingEntity } from 'src/modules/entity/mysql/History_Parking.entity';
import { ParkingEntity } from 'src/modules/entity/mysql/Parking.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(ParkingEntity)
    private readonly parkingRepository: Repository<ParkingEntity>,
    @InjectRepository(HistoryParkingEntity)
    private readonly historyParkingRepository: Repository<HistoryParkingEntity>,
  ) {}

  @WebSocketServer() private server: Server;

  getHello(): string {
    return 'Hello World!';
  }

  async getSrf() {
    return await this.parkingRepository.find({
      select: { parking_name: true, full: true },
    });
  }

  async getOneSrf({ parking_name }: { parking_name: string }) {
    const res = await this.parkingRepository
      .createQueryBuilder('parking')
      .leftJoinAndSelect('parking.history_parking', 'history')
      .select([
        'parking.parking_name',
        'parking.full',
        'history.full',
        'history.date',
      ])
      .orderBy('history.date', 'ASC')
      .where('parking.parking_name = :parking_name', { parking_name })
      .getOne();
    return res.history_parking;
  }

  async createParking({
    full,
    parking_name,
  }: {
    parking_name: string;
    full: boolean;
  }) {
    const existParking = await this.parkingRepository.findOne({
      where: { parking_name: parking_name },
    });
    if (!existParking) {
      const newParking = this.parkingRepository.create({
        full,
        parking_name: parking_name,
      });
      await this.parkingRepository.save(newParking);
    }
  }

  async updateStatusParking({
    full,
    parking,
    date,
  }: {
    parking: string;
    full: boolean;
    date: Date;
  }) {
    await this.parkingRepository.update({ parking_name: parking }, { full });
    const findParking = await this.parkingRepository.findOne({
      where: { parking_name: parking },
    });
    const newHistory = this.historyParkingRepository.create({
      full,
      date,
      parking: findParking,
    });
    await this.historyParkingRepository.save(newHistory);
    return { ok: true };
  }

  // @SubscribeMessage('message')
  // updateSensor({ distance }: { distance: number }) {
  //   this.server.emit(`asd`, { code: 1, sensor: 'd', distance });
  // }
}
