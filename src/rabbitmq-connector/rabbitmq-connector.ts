import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

export const RabbitmqConnector = ClientsModule.registerAsync([{
  name: 'SCIENTIST_OPERATOR_SERVICE',
  useFactory: async (configService: ConfigService) => {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>("rabbitmq.url")],
        queue: 'scientist-operations',
        queueOptions: {
          durable: true
        },
      },
    }
  },
  inject: [ConfigService]
}])
