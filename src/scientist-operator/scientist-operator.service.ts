import { Injectable } from '@nestjs/common';

@Injectable()
export class ScientistOperatorService {

  register(operation: object): string {
    return "register-ok"
  }

  publish(operation: object): string {
    return "publish-ok"
  }
}
