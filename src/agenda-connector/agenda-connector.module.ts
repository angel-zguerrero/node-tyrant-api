import { Global, Module } from '@nestjs/common';
import { AgendaConnector, AgendaScheduler } from './agenda-connector';

@Global()
@Module({
  providers: [AgendaConnector, AgendaScheduler],
  exports: ['AGENDA_INSTANCE', AgendaScheduler]
})
export class AgendaConnectorModule {}
