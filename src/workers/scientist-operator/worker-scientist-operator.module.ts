import { Global, Module } from '@nestjs/common';
import { WorkerScientistOperatorController } from './worker-scientist-operator.controller';

@Global()
@Module({
  controllers: [WorkerScientistOperatorController]
})
export class WorkerScientistOperatorModule {}
