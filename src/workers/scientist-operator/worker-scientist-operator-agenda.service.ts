import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Agenda } from 'agenda'

@Injectable()
export class WorkerScientistOperatorAgendaService implements OnModuleInit {
  constructor(@Inject('AGENDA_INSTANCE') private readonly agendaInstance: Agenda) { }
  onModuleInit() {
    this.initMarkStuckScientistOperationsAsFailed()
  }
  async initMarkStuckScientistOperationsAsFailed() {
    let interval = "20 seconds"
    this.agendaInstance.define(
      "MarkStuckScientistOperationsAsFailed",
      async (job) => {
        try {
          console.log("MarkStuckScientistOperationsAsFailed.....")
        } catch (error) {
          throw error
        }
      }
    );
    let task = {}
    let job = this.agendaInstance.create("MarkStuckScientistOperationsAsFailed",{});
    let uniqTask = { ...task };
    job.unique(uniqTask);
    job.repeatEvery(interval);
    await job.save();
  }
}
