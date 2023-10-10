import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/dtos/user/create-user.dto';

@Injectable()
export class AuthService {
  public async login() {
    return 'Login';
  }

  public async register(user: CreateUserDTO) {
    return 'Register';
  }
}
