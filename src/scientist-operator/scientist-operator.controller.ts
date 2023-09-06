import { Body, Controller, Post } from '@nestjs/common';
import { ScientistOperatorService } from './scientist-operator.service';

@Controller('scientist-operator')
export class ScientistOperatorController {
  constructor(private readonly scientistOperatorService: ScientistOperatorService){}
  @Post('solve')
  solve(@Body() operation: object): object {
    return {
      register: this.scientistOperatorService.register(operation),
      publish: this.scientistOperatorService.publish(operation)
    }
  }
}
