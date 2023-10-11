import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDTO } from '@dtos/user';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  public async findAll(): Promise<UserDTO[]> {
    const users = await this.userService.findAll();

    return users;
  }
}
