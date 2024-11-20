import { Body, Controller, Post } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorGateway } from './sensor.gateway';

@Controller('sensor')
export class SensorController {
  constructor(
    private readonly sensorService: SensorService,
    private readonly sensorGateway: SensorGateway,
  ) {}

  @Post('parking/srf')
  printDis(@Body() body: { full: boolean; parking: string }): string {
    console.log(body);
    const res = this.sensorService.getHello();
    this.sensorGateway.updateSensorSrf({
      full: body.full,
      parking: body.parking,
    });
    return res;
  }
}
