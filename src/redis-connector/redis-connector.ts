import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis'

export const RedisConnector = {
  inject: [ConfigService],
  provide: 'REDIS_CLIENT',
  useFactory: async (configService: ConfigService): Promise<Redis>=>{
    const redis = new Redis({
      port: configService.get<number>("redis.port"), 
      host: configService.get<string>("redis.host"), 
      username: configService.get<string>("redis.username"), 
      password: configService.get<string>("redis.password")
    });
    await redis.set("tyrant-api-test", "true", 'EX', 100)
    return redis
  }
}
