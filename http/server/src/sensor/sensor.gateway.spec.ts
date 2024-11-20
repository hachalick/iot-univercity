import { Test, TestingModule } from '@nestjs/testing';
import { SensorGateway } from './sensor.gateway';

describe('SensorGateway', () => {
  let gateway: SensorGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SensorGateway],
    }).compile();

    gateway = module.get<SensorGateway>(SensorGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
