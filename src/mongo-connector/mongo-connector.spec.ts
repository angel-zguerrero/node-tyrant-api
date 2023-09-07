import { Test, TestingModule } from '@nestjs/testing';
import { MongoConnector } from './mongo-connector.provider';

describe('MongoConnector', () => {
  let provider: MongoConnector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoConnector],
    }).compile();

    provider = module.get<MongoConnector>(MongoConnector);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
