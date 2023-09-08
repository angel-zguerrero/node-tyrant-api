import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ScientistOperatorService } from './scientist-operator.service';
import Redis from 'ioredis';
import { CreateScientistOperationDto } from './dtos/scientist-operation.dto';

@Controller('scientist-operator')
export class ScientistOperatorController {
  constructor(private readonly scientistOperatorService: ScientistOperatorService, @Inject('REDIS_CLIENT') private readonly redisConnector: Redis) { }
  @Post('solve')
  async solve(@Body() scientistOperation: CreateScientistOperationDto): Promise<object> {
    await this.redisConnector.incr("scientist-operations-counter")
    return {
      register: (await this.scientistOperatorService.register(scientistOperation)),
      publish: (await this.scientistOperatorService.publish(scientistOperation))
    }
  }
}
