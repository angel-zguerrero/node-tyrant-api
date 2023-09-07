import { Test, TestingModule } from '@nestjs/testing';
import { RedisConnector } from './redis-connector';

describe('RedisConnector', () => {
  let provider: RedisConnector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisConnector],
    }).compile();

    provider = module.get<RedisConnector>(RedisConnector);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
