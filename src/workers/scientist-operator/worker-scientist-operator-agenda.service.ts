import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {Agenda} from 'agenda'

@Injectable()
export class WorkerScientistOperatorAgendaService implements OnModuleInit {
  constructor(@Inject('AGENDA_INSTANCE') private readonly agendaInstance: Agenda){}
  onModuleInit() {
    this.initClearOperationToFaildJob()
  }
  async initClearOperationToFaildJob () {

  }
}
