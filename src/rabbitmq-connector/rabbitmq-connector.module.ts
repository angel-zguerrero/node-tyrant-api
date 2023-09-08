//@ts-check
import { Global, Module } from '@nestjs/common';
import { ScientistOperatorConnector } from './rabbitmq-connector';


@Global()
@Module({
  imports: [ScientistOperatorConnector],
  exports: [ScientistOperatorConnector]
})
export class RabbitmqConnectorModule { }
