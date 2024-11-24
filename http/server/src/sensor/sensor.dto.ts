import { ApiProperty } from '@nestjs/swagger';

export class ParkingSrfDto {
  @ApiProperty({ default: false })
  full: boolean;

  @ApiProperty({ default: 'Fl|0-P|A1' })
  parking_name: string;
}
