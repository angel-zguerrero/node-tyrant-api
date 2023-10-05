import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateScientistOperationNotification } from 'src/scientist-operator/dtos/scientist-operation.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NeptuneConnector {
  constructor(private readonly httpService: HttpService,  private readonly configService: ConfigService){}
  async sendWebhookNotification(notificationCode: string, operationIds: string[]){
    try {
      let createScientistOperationNotification = new CreateScientistOperationNotification()
      createScientistOperationNotification.code = notificationCode
      createScientistOperationNotification.operation_ids = operationIds

      await lastValueFrom(this.httpService.post(this.configService.get<string>("workers.scientist-operator.scientist-operations-notification-webhook"), createScientistOperationNotification))
    } catch (error) {
      console.log("Handling axios error.")
      console.log(error.stack)
    }
  }
}
