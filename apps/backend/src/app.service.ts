import { Injectable } from '@nestjs/common';

/** Provides application-level operations for the root controller. */
@Injectable()
export class AppService {
  /** Returns the backend's root-route health message. */
  getHello(): string {
    return 'Hello World!';
  }
}
