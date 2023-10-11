import { PublicRoute } from '@decorators/public-route.decorator';
import { LoginDTO, RefreshDTO } from '@dtos/auth';
import { TokenDTO } from '@dtos/auth/Token.dto';
import { UserCreateDTO, UserDTO } from '@dtos/user';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import { RefreshTokenGuard } from '@guards/refresh-token.guard';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { RequestWithUserAndJWT } from '../../types';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @PublicRoute()
  @ApiCreatedResponse({ description: 'User created', type: UserDTO })
  @ApiBadRequestResponse({
    description: 'Password is not strong enough',
    content: {
      'application/json': {
        example: {
          message: [
            'Password must be at least 8 characters long, contain at least 1 number, 1 symbol, and 1 uppercase letter',
          ],
        },
      },
    },
  })
  public async register(@Body() user: UserCreateDTO): Promise<UserDTO> {
    const createdUser = await this.authService.register(user);

    console.log('REGISTER METHOD', {
      plain: createdUser,
      formatted: plainToInstance(UserDTO, createdUser),
    });

    return plainToInstance(UserDTO, createdUser);
  }

  @Post('/login')
  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @ApiOkResponse({
    description: 'User logged in',
    content: {
      'application/json': {
        example: {
          jwt: 'jwt',
          refreshToken: 'refreshToken',
        },
      },
    },
  })
  public async login(@Body() user: LoginDTO): Promise<TokenDTO> {
    const tokens = await this.authService.login(user);

    return plainToInstance(TokenDTO, tokens);
  }

  @Post('/refresh')
  @PublicRoute()
  @UseGuards(RefreshTokenGuard)
  @ApiBody({
    description: 'Refresh token',
    type: RefreshDTO,
  })
  async refreshToken(@Req() { user: { id, username } }: RequestWithUserAndJWT) {
    const tokens = await this.authService.refreshTokens({
      sub: id,
      username: username,
    });

    return plainToInstance(TokenDTO, tokens);
  }
}
