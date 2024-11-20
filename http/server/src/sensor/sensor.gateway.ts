import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SensorService } from './sensor.service';

@WebSocketGateway()
export class SensorGateway {
  @WebSocketServer() private server: Server;

  constructor(private readonly sensorService: SensorService) {}

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  updateSensorSrf({ full, parking }: { full: boolean; parking: string }) {
    this.server.emit(`sensor-srf`, { code: 1, parking, full });
  }
}
