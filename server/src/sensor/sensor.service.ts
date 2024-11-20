import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class SensorService {
  @WebSocketServer() private server: Server;

  getHello(): string {
    return 'Hello World!';
  }

  // @SubscribeMessage('message')
  // updateSensor({ distance }: { distance: number }) {
  //   this.server.emit(`asd`, { code: 1, sensor: 'd', distance });
  // }
}
