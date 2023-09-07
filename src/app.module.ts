import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoConnectorModule } from './mongo-connector/mongo-connector.module';
import { ScientistOperatorModule } from './scientist-operator/scientist-operator.module';
import { RabbitmqConnectorModule } from './rabbitmq-connector/rabbitmq-connector.module';
import { ConfigProvider } from './config/config.provider';

@Module({
  imports: [MongoConnectorModule, ScientistOperatorModule, RabbitmqConnectorModule],
  controllers: [AppController],
  providers: [AppService, ConfigProvider],
})
export class AppModule {}
