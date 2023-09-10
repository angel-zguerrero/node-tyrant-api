import { Global, Module } from '@nestjs/common';
import { NeptuneConnector } from './neptune/neptune-connector';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  providers: [NeptuneConnector],
  exports:[NeptuneConnector],
  imports: [HttpModule]
})
export class IntegrationsModule {}
