import { CreateUserDTO, UserDTO } from '@dtos/user';
import { UserService } from '@modules/user/user.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '../../types';
import { ConfigService } from '@nestjs/config';
import { LoginDTO } from '@dtos/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(user: CreateUserDTO) {
    const foundUser = await this.userService.findByUsername(user.username);

    if (foundUser) {
      throw new ConflictException(
        `A user with the username ${user.username} already exists.`,
      );
    }

    const createdUserCount = await this.userService.create(user);

    if (createdUserCount === 0) {
      throw new InternalServerErrorException(
        'Unknown error when creating user.',
      );
    }

    return user;
  }

  public async login(user: LoginDTO) {
    const foundUser = await this.userService.findByUsername(user.username);

    // Purposefully keeping the error message vague to prevent user enumeration
    if (!foundUser) {
      throw new NotFoundException(`Invalid username or password`);
    }

    const isPasswordValid = await this.userService.validatePassword(
      user.password,
      foundUser.password,
    );

    // Purposefully keeping the error message vague to prevent user enumeration
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const jwtPayload: JwtPayload = {
      sub: foundUser.id,
      username: foundUser.username,
    };

    return {
      jwt: await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      }),
      refreshToken: await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
      }),
    };
  }
}
