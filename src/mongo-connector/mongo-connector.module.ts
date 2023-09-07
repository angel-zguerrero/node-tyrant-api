import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  providers: [],
  imports: [MongooseModule.forRoot('mongodb://tyrant-api-mongo:27017,tyrant-api-mongo:27018,tyrant-api-mongo:27019/tyrant?replicaSet=rs')]
})
export class MongoConnectorModule {}
