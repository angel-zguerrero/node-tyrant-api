import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agenda } from 'agenda'
const os = require("os");

export const AgendaConnector = {
  inject: [ConfigService],
  provide: 'AGENDA_INSTANCE',
  useFactory: async (configService: ConfigService): Promise<Agenda> => {
    const agenda = new Agenda({ name: os.hostname() + "-" + process.pid, db: { address: configService.get<string>("mongodb.uri") } });
    await agenda.start();
    return agenda
  }
}

@Injectable()
export class AgendaScheduler {
  constructor(@Inject('AGENDA_INSTANCE') private readonly agendaInstance: Agenda) { }

  async scheduleJob(jobName: string, interval: string, callback: Function, parameters: object) {
    this.agendaInstance.define(
      jobName,
      async (job) => {
        try {
          await callback(job)
        } catch (error) {
          console.log(error.stack)
          throw error
        }
      }
    );
    let job = this.agendaInstance.create(jobName, parameters);
    let uniqTask = { ...parameters };
    job.unique(uniqTask);
    job.repeatEvery(interval);
    await job.save();
  }
}
