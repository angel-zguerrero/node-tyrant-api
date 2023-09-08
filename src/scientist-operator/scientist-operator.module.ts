import { Module } from '@nestjs/common';
import { ScientistOperatorService } from './scientist-operator.service';
import { ScientistOperatorController } from './scientist-operator.controller';
import { ScientistOperation, ScientistOperationSchema } from './schemas/scientist-operation.schema';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [MongooseModule.forFeature([{ name: ScientistOperation.name, schema: ScientistOperationSchema }])],
  providers: [ScientistOperatorService],
  controllers: [ScientistOperatorController],
})
export class ScientistOperatorModule { }
