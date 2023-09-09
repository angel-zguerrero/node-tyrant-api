import { ConfigService } from '@nestjs/config';
import {Agenda} from 'agenda'
export const AgendaConnector = {
  inject: [ConfigService],
  provide: 'AGENDA_INSTANCE',
  useFactory: async (configService: ConfigService): Promise<Agenda>=>{
    const agenda = new Agenda({ db: { address: configService.get<string>("mongodb.uri") } });
    return agenda
  }
}
