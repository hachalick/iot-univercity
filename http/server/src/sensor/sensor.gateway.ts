import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SensorService } from './sensor.service';

@WebSocketGateway({ cors: '*' })
export class SensorGateway {
  @WebSocketServer() private server: Server;

  constructor(private readonly sensorService: SensorService) {}

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  updateSensorSrf({
    full,
    parking_name,
    date,
  }: {
    full: boolean;
    parking_name: string;
    date: Date;
  }) {
    this.server.emit(parking_name, { code: 1, parking_name, full, date: date.toISOString() });
  }
}
