import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '@dtos/user';

@Injectable()
export class AuthService {
  public async login() {
    return 'Login';
  }

  public async register(user: CreateUserDTO) {
    return 'Register';
  }
}
