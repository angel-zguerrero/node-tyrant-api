import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ScientistOperatorService } from './scientist-operator.service';
import { CreateScientistOperationDto } from './dtos/scientist-operation.dto';
import mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

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

  @Get('find/:id')
  async find(@Param('id') id: string) {
    let result = undefined
    try {
      result = await this.scientistOperatorService.findById(id)
      if (result) {
        return result
      }
    } catch (error) {
      throw new HttpException('Scientist operation not found', HttpStatus.NOT_FOUND, { cause: error });
    }
    if(!result){
      throw new HttpException('Scientist operation not found', HttpStatus.NOT_FOUND);
    }
  }
}
