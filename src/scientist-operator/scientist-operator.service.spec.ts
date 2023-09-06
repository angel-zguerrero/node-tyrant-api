import { Test, TestingModule } from '@nestjs/testing';
import { ScientistOperatorService } from './scientist-operator.service';

describe('ScientistOperatorService', () => {
  let service: ScientistOperatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScientistOperatorService],
    }).compile();

    service = module.get<ScientistOperatorService>(ScientistOperatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
