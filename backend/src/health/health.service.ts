import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  check() {
    return {
      status: 'ok',
      service: 'scentpulse-api',
      timestamp: new Date().toISOString(),
    };
  }
}
