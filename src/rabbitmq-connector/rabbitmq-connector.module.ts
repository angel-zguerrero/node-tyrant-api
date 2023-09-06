import {Global, Module } from '@nestjs/common';
const Broker = require('rascal').Broker;

@Global()
@Module({})
export class RabbitmqConnectorModule {}
