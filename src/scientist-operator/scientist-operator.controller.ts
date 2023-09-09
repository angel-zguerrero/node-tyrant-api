import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ScientistOperatorService } from './scientist-operator.service';
import { CreateScientistOperationDto } from './dtos/scientist-operation.dto';
import mongoose from 'mongoose';
import {InjectConnection} from '@nestjs/mongoose';

@Controller('scientist-operator')
export class ScientistOperatorController {
  constructor(private readonly scientistOperatorService: ScientistOperatorService, @InjectConnection() private readonly connection: mongoose.Connection) { }
  @Post('solve')
  async solve(@Body() scientistOperation: CreateScientistOperationDto): Promise<object> {
    const session = await this.connection.startSession();
    try {
      let scientistOperationResult = await this.scientistOperatorService.register(scientistOperation, session)
      let publishResult = await this.scientistOperatorService.publish(scientistOperationResult)
      return {
        register: scientistOperationResult,
        publish: publishResult
      }
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
    } finally {
      await session.endSession();
    }

  }
}
