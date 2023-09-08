//@ts-check
import {Global, Module } from '@nestjs/common';
import { RabbitmqConnector } from './rabbitmq-connector';


@Global()
@Module({
  imports: [RabbitmqConnector],
  exports:[RabbitmqConnector]
})
export class RabbitmqConnectorModule {}
