import { ConfigService } from '@nestjs/config';
import {Agenda} from 'agenda'
const os = require("os");

export const AgendaConnector = {
  inject: [ConfigService],
  provide: 'AGENDA_INSTANCE',
  useFactory: async (configService: ConfigService): Promise<Agenda>=>{
    const agenda = new Agenda({ name: os.hostname() +  "-" + process.pid, db: { address: configService.get<string>("mongodb.uri") } });
    await agenda.start();
    return agenda
  }
}
