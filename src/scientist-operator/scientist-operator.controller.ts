import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ScientistOperatorService } from './scientist-operator.service';
import Redis from 'ioredis';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';

@Controller('scientist-operator')
export class ScientistOperatorController {
  constructor(private readonly scientistOperatorService: ScientistOperatorService, @Inject('REDIS_CLIENT') private readonly redisConnector: Redis, @Inject('SCIENTIST_OPERATOR_SERVICE') private readonly scientistOperatorConnector: ClientProxy) { }
  @Post('solve')
  async solve(@Body() operation: object): Promise<object> {
    await this.redisConnector.incr("scientist-operations-counter")
    const message = operation;
    const record = new RmqRecordBuilder(message)
      .setOptions({
        headers: {
          ['x-version']: '1.0.0',
        },
        priority: 3,
      })
      .build();
    await this.scientistOperatorConnector.send('scientist-operations', record)
      .subscribe()
    return {
      register: this.scientistOperatorService.register(operation),
      publish: this.scientistOperatorService.publish(operation)
    }
  }
}
