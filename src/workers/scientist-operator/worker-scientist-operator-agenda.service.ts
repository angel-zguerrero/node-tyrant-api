import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'agenda';
import { Model } from 'mongoose';
import { AgendaScheduler } from 'src/agenda-connector/agenda-connector';
import { NeptuneConnector } from 'src/integrations/neptune/neptune-connector';
import { ScientistOperation } from 'src/scientist-operator/schemas/scientist-operation.schema';

@Injectable()
export class WorkerScientistOperatorAgendaService implements OnModuleInit {
  constructor(private readonly agendaScheduler: AgendaScheduler, private readonly configService: ConfigService,
    @InjectModel(ScientistOperation.name) private scientistOperationModel: Model<ScientistOperation>, 
    private readonly neptune: NeptuneConnector) { }
  onModuleInit() {
    this.initMarkStuckScientistOperationsAsFailed()
  }
  async initMarkStuckScientistOperationsAsFailed() {
    let self = this;
    let jobCallback = async (job: Job) => {
      let limit = self.configService.get<number>("workers.scientist-operator.stuck-scientist-operations-as-failed-limit")
      let window = self.configService.get<number>("workers.scientist-operator.stuck-scientist-operations-as-failed-window")
      let expiredScientistOperations = await self.scientistOperationModel.find({
        createdAt: {
          $lt: new Date(new Date().getTime() - window * 60 * 1000).toISOString()
        },
        status: "pending"
      })
        .select({ _id: 1, status: 1 })
        .sort({ createdAt: 1 })
        .limit(limit)

      if (expiredScientistOperations.length > 0) {
        let expiredScientistOperationIds = expiredScientistOperations.map((item) => {
          return item._id
        })
        await self.scientistOperationModel.updateMany({
          _id: {
            $in: expiredScientistOperationIds
          }
        },
          {
            status: "failed",
            failedReason: "Timeout for operation resolution"
          })

        try {
          let operationIds = expiredScientistOperationIds.map((item) => { return item.toString() })
          await self.neptune.sendWebhookNotification( "timeout-for-operation-resolution-notification", operationIds)
        } catch (error) {
          console.log(error.stack)
        }

      }
    }
    let interval = this.configService.get<string>("workers.scientist-operator.stuck-scientist-operations-as-failed-interval")
    await this.agendaScheduler.scheduleJob("MarkStuckScientistOperationsAsFailed", interval, jobCallback, {})
  }
}
