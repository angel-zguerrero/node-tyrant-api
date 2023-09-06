import { Test, TestingModule } from '@nestjs/testing';
import { ScientistOperatorController } from './scientist-operator.controller';

describe('ScientistOperatorController', () => {
  let controller: ScientistOperatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScientistOperatorController],
    }).compile();

    controller = module.get<ScientistOperatorController>(ScientistOperatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
