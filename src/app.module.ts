import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoConnectorModule } from './mongo-connector/mongo-connector.module';
import { ScientistOperatorModule } from './scientist-operator/scientist-operator.module';
import { RabbitmqConnectorModule } from './rabbitmq-connector/rabbitmq-connector.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
@Module({
  imports: [MongoConnectorModule, ScientistOperatorModule, RabbitmqConnectorModule, ConfigModule.forRoot({ isGlobal: true, load: [configuration] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
