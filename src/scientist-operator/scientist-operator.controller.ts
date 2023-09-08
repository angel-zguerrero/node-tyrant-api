import { Body, Controller, Post } from '@nestjs/common';
import { ScientistOperatorService } from './scientist-operator.service';
import { CreateScientistOperationDto } from './dtos/scientist-operation.dto';

@Controller('scientist-operator')
export class ScientistOperatorController {
  constructor(private readonly scientistOperatorService: ScientistOperatorService) { }
  @Post('solve')
  async solve(@Body() scientistOperation: CreateScientistOperationDto): Promise<object> {
    return {
      register: (await this.scientistOperatorService.register(scientistOperation)),
      publish: (await this.scientistOperatorService.publish(scientistOperation))
    }
  }
}
