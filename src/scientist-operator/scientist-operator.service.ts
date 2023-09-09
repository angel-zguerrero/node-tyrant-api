import { Inject, Injectable } from '@nestjs/common';
import { ScientistOperation } from './schemas/scientist-operation.schema';
import { ClientSession, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateScientistOperationDto } from './dtos/scientist-operation.dto';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import Redis from 'ioredis';
@Injectable()
export class ScientistOperatorService {

  constructor(@InjectModel(ScientistOperation.name) private scientistOperationModel: Model<ScientistOperation>, @Inject('SCIENTIST_OPERATOR_CLIENT') private readonly scientistOperatorClient: ClientProxy, @Inject('REDIS_CLIENT') private readonly redisConnector: Redis) { }

  async register(scientistOperationDto: CreateScientistOperationDto, clientSession: ClientSession): Promise<ScientistOperation> {
    await this.redisConnector.incr("scientist-operations-counter")
    const createdScientistOperation = new this.scientistOperationModel(scientistOperationDto);
    return await createdScientistOperation.save({session: clientSession});
  }

  async publish(scientistOperation: ScientistOperation): Promise<string> {
    const message = scientistOperation;
    const record = new RmqRecordBuilder(message)
      .setOptions({
        headers: {
          ['x-version']: '1.0.0',
        },
        priority: 3,
      })
      .build();
    await this.scientistOperatorClient.send('scientist-operations-to-solve', record)
      .subscribe()
    return "publish-ok"
  }
}
