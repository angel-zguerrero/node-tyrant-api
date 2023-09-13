import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class Encryption {
  iv: Buffer
  password: string
  constructor(private readonly configService: ConfigService){
    this.iv =  Buffer.alloc(16, 0);
    this.password = this.configService.get<string>("encryption.password");
  }
  async encrypt(text: string): Promise<string> {
    const key = (await promisify(scrypt)(this.password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, this.iv);
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted
  }

  async decrypt(text: string): Promise<string> {
    const key = (await promisify(scrypt)(this.password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, this.iv);
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec
  }
}
