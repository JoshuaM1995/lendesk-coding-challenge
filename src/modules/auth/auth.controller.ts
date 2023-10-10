import { CreateUserDTO, UserDTO } from '@dtos/user';
import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';

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
  public async login() {
    return this.authService.login();
  }
}
