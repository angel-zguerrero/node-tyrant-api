import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class WorkerScientistOperatorController {
  @MessagePattern('scientist-operations-solved')
  getScientistOperationsSolvedNotifications(@Payload() data: object, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const operationResult = JSON.parse(context.getMessage().content.toString())
    console.log("operationResult")    
    console.log(operationResult)    

    channel.ack(originalMsg);
  }

}
