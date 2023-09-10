import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'agenda';
import { AgendaScheduler } from 'src/agenda-connector/agenda-connector';

@Injectable()
export class WorkerScientistOperatorAgendaService implements OnModuleInit {
  constructor(private readonly agendaScheduler: AgendaScheduler, private readonly configService: ConfigService) { }
  onModuleInit() {
    this.initMarkStuckScientistOperationsAsFailed()
  }
  async initMarkStuckScientistOperationsAsFailed() {
    let jobCallback = async (job: Job) =>{
      console.log("excuting MarkStuckScientistOperationsAsFailed ")
      console.log(job.attrs)
    }
    let interval = this.configService.get<string>("workers.scientist-operator.stuck-scientist-operations-as-failed-interval")
    await this.agendaScheduler.scheduleJob("MarkStuckScientistOperationsAsFailed", interval, jobCallback, {})
  }
}
