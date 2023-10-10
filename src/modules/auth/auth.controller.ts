import { CreateUserDTO, UserDTO } from '@dtos/user';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { TokenDTO } from '@dtos/token/Token.dto';
import { LoginDTO } from '@dtos/auth';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
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
  public async register(@Body() user: CreateUserDTO) {
    const createdUser = await this.authService.register(user);

    return plainToInstance(UserDTO, createdUser);
  }

  @Post('/login')
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
  public async login(@Body() user: LoginDTO) {
    const tokens = await this.authService.login(user);

    return plainToInstance(TokenDTO, tokens);
  }
}
