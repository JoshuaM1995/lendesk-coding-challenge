import { LoginDTO, TokenDTO } from '@dtos/auth';
import { UserCreateDTO } from '@dtos/user';
import { UserService } from '@modules/user';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtPayload } from '../../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(user: UserCreateDTO): Promise<UserCreateDTO> {
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

  public async login(user: LoginDTO): Promise<TokenDTO> {
    const foundUser = await this.userService.findByUsername(user.username);

    // Purposefully keeping the error message vague to prevent user enumeration
    if (!foundUser) {
      throw new UnauthorizedException(`Invalid username or password`);
    }

    const jwtPayload: JwtPayload = {
      sub: foundUser.id,
      username: foundUser.username,
    };

    return this.getTokens(jwtPayload);
  }

  public async validateUser(username: string, password: string) {
    const foundUser = await this.userService.findByUsername(username);

    // Purposefully keeping the error message vague to prevent user enumeration
    if (!foundUser) {
      throw new UnauthorizedException(`Invalid username or password`);
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      foundUser.password,
    );

    // Purposefully keeping the error message vague to prevent user enumeration
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return foundUser;
  }

  public async refreshTokens(payload: JwtPayload) {
    // TODO: Blacklist old access token and refresh token

    const { accessToken, refreshToken } = await this.getTokens(payload);

    return { ...payload, accessToken, refreshToken };
  }

  public async getTokens(payload: JwtPayload): Promise<TokenDTO> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
