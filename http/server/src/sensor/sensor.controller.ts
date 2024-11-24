import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { SensorGateway } from './sensor.gateway';
import { ParkingSrfDto } from './sensor.dto';

@Controller('sensor')
export class SensorController {
  constructor(
    private readonly sensorService: SensorService,
    private readonly sensorGateway: SensorGateway,
  ) {}

  @Get('srf')
  getSrf() {
    return this.sensorService.getSrf();
  }

  @Get('srf:parking_name')
  getOneSrf(@Query('parking_name') parking_name: string) {
    console.log("dfs")
    return this.sensorService.getOneSrf({ parking_name });
  }

  @Post('parking/srf')
  async createParking(@Body() body: ParkingSrfDto) {
    return this.sensorService.createParking({
      full: body.full,
      parking_name: body.parking_name,
    });
  }

  @Put('parking/srf')
  async updateStatusParking(@Body() body: ParkingSrfDto) {
    const date = new Date();
    const res = await this.sensorService.updateStatusParking({
      full: body.full,
      parking: body.parking_name,
      date,
    });
    this.sensorGateway.updateSensorSrf({
      full: body.full,
      parking_name: body.parking_name,
      date,
    });
    return res;
  }
}
