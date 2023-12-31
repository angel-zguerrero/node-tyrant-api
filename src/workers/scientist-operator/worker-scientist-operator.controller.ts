import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NeptuneConnector } from 'src/integrations/neptune/neptune-connector';
import { ScientistOperation } from 'src/scientist-operator/schemas/scientist-operation.schema';

@Controller()
export class WorkerScientistOperatorController {

  constructor(private readonly neptune: NeptuneConnector, @InjectModel(ScientistOperation.name) private scientistOperationModel: Model<ScientistOperation>){}

  @MessagePattern('scientist-operations-solved')
  async getScientistOperationsSolvedNotifications(@Ctx() context: RmqContext) {

    try {
      console.log(`Pattern: ${context.getPattern()}`);
      const originalMsg = context.getMessage();
      const channel = context.getChannelRef();

      try {
        const operationResult = JSON.parse(context.getMessage().content.toString())
        let payload : any = {
          status: operationResult.status,
          resultData: operationResult.result,
          failedReason: operationResult.failedReason
        }

        if(operationResult.progress_increase){
          payload.$inc = {
            progress: operationResult.progress_increase
          }
        }else{

        }

        if(payload.status == "success"){
          payload.progress = 100;
        }
  
        await this.scientistOperationModel.updateMany({
            _id: {
              $in: [operationResult._id]
            },
            status:{
              $nin: ["success", "failed"]
            }
          },
          payload
        )
        let resolutionNotification = operationResult.status == "success"? "sucess-resolution-notification": "failed-resolution-notification"
        let operationIds = [operationResult._id]
        await this.neptune.sendWebhookNotification(resolutionNotification, operationIds)
      } catch (error) {
        console.error(error)
      }finally{
        channel.ack(originalMsg);
      }
    } catch (generalError) {
      console.error(generalError)
    }
  }
}
