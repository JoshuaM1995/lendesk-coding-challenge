import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDTO } from 'src/dtos/user/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from 'src/dtos/user/user.dto';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login() {
    return this.authService.login();
  }

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
}
