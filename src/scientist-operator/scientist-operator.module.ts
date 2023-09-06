import { Module } from '@nestjs/common';
import { ScientistOperatorService } from './scientist-operator.service';
import { ScientistOperatorController } from './scientist-operator.controller';

@Module({
  providers: [ScientistOperatorService],
  controllers: [ScientistOperatorController],
})
export class ScientistOperatorModule {}
