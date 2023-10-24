import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { RequestWithJWTUser } from 'types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      passReqToCallback: true,
    });
  }

  public async validate(
    request: RequestWithJWTUser,
    username: string,
    password: string,
  ) {
    // TODO: Refactor this to check the JWT token expiry
    if (request.headers.authorization) {
      throw new NotAcceptableException(
        `Username ${username} is already logged in`,
      );
    }

    const user = await this.authService.validateUser(username, password);

    return {
      id: user.id,
      username: user.username,
      password,
    };
  }
}
