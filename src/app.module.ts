import { Module } from '@nestjs/common';
import { AgendaConnectorModule } from './agenda-connector/agenda-connector.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoConnectorModule } from './mongo-connector/mongo-connector.module';
import { ScientistOperatorModule } from './scientist-operator/scientist-operator.module';
import { RabbitmqConnectorModule } from './rabbitmq-connector/rabbitmq-connector.module';
import { ConfigModule } from '@nestjs/config';
import { RedisConnectorModule } from './redis-connector/redis-connector.module';
import { WorkersModule } from './workers/workers.module';
import { IntegrationsModule } from './integrations/integrations.module';
import configuration from './config/configuration';
@Module({
  imports: [MongoConnectorModule,
    RedisConnectorModule,
    ScientistOperatorModule,
    RabbitmqConnectorModule,
    AgendaConnectorModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    WorkersModule,
    IntegrationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
