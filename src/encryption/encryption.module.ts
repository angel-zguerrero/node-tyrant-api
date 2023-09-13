import { Global, Module } from '@nestjs/common';
import { Encryption } from './encryption';

@Global()
@Module({
  providers: [Encryption],
  exports: [Encryption]
})
export class EncryptionModule {}
