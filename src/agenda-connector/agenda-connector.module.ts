import { Global, Module } from '@nestjs/common';
import { AgendaConnector } from './agenda-connector';

@Global()
@Module({
  providers: [AgendaConnector],
  exports: ['AGENDA_INSTANCE']
})
export class AgendaConnectorModule {}
