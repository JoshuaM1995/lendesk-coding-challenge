import { UserDTO } from '@dtos/user';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  public async validate(username: string, password: string): Promise<UserDTO> {
    const user = await this.authService.validateUser(username, password);

    return {
      id: user.id,
      username: user.username,
      password,
    };
  }
}
