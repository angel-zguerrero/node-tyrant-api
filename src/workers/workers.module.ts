import { Global, Module } from '@nestjs/common';
import { WorkerScientistOperatorModule } from './scientist-operator/worker-scientist-operator.module';

@Global()
@Module({
  imports: [WorkerScientistOperatorModule]
})
export class WorkersModule { }
