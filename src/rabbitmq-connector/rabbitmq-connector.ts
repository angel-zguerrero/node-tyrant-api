import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

export const ScientistOperatorConnector = ClientsModule.registerAsync([{
  name: 'SCIENTIST_OPERATOR_CLIENT',
  useFactory: async (configService: ConfigService) => {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>("rabbitmq.url")],
        queue: configService.get<string>("rabbitmq.scientist-operations-to-solve-queue"),
        queueOptions: {
          durable: true
        },
      },
    }
  },
  inject: [ConfigService]
}])
