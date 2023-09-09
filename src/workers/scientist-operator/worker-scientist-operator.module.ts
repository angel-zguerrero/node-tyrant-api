import { Global, Module } from '@nestjs/common';
import { WorkerScientistOperatorController } from './worker-scientist-operator.controller';
import { WorkerScientistOperatorAgendaService } from './worker-scientist-operator-agenda.service';

@Global()
@Module({
  controllers: [WorkerScientistOperatorController],
  providers: [WorkerScientistOperatorAgendaService]
})
export class WorkerScientistOperatorModule {}
