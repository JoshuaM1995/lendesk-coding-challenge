import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  public async login() {
    return 'Hello World 2';
  }
}
