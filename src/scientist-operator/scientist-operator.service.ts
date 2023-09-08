import { Inject, Injectable } from '@nestjs/common';
import { ScientistOperation, ScientistOperationDocument } from './schemas/scientist-operation.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateScientistOperationDto } from './dtos/scientist-operation.dto';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';

@Injectable()
export class ScientistOperatorService {

  constructor(@InjectModel(ScientistOperation.name) private scientistOperationModel: Model<ScientistOperation>, @Inject('SCIENTIST_OPERATOR_SERVICE') private readonly scientistOperatorConnector: ClientProxy) { }

  async register(scientistOperationDto: CreateScientistOperationDto): Promise<ScientistOperation> {
    const createdScientistOperation = new this.scientistOperationModel(scientistOperationDto);
    return await createdScientistOperation.save();
  }

  async publish(scientistOperationDto: CreateScientistOperationDto): Promise<string> {
    const message = scientistOperationDto;
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
    return "publish-ok"
  }
}
