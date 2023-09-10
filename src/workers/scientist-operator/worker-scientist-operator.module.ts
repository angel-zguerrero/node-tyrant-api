import { Global, Module } from '@nestjs/common';
import { WorkerScientistOperatorController } from './worker-scientist-operator.controller';
import { WorkerScientistOperatorAgendaService } from './worker-scientist-operator-agenda.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  controllers: [WorkerScientistOperatorController],
  providers: [WorkerScientistOperatorAgendaService],
  imports: [HttpModule]
})
export class WorkerScientistOperatorModule {}
