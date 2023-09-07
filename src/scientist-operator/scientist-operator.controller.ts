import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ScientistOperatorService } from './scientist-operator.service';
import Redis from 'ioredis';

@Controller('scientist-operator')
export class ScientistOperatorController {
  constructor(private readonly scientistOperatorService: ScientistOperatorService, @Inject('REDIS_CLIENT') private readonly redisConnector: Redis) { }
  @Post('solve')
  async solve(@Body() operation: object): Promise<object> {
    await this.redisConnector.incr("counter")
    return {
      register: this.scientistOperatorService.register(operation),
      publish: this.scientistOperatorService.publish(operation)
    }
  }
}
