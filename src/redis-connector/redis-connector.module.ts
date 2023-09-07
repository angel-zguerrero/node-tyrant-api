import { Global, Module } from '@nestjs/common';
import { RedisConnector } from './redis-connector';
@Global()
@Module({
  providers: [RedisConnector],
  exports: ['REDIS_CLIENT']
})
export class RedisConnectorModule {
  
}
