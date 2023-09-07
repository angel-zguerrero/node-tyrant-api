import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Global()
@Module({
  providers: [],
  imports: [MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (configService: ConfigService)=>({
      uri: configService.get<string>("mongodb.uri")
    })
  })]
})
export class MongoConnectorModule {}
