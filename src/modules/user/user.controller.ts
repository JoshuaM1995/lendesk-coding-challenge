import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  public async findAll() {
    const users = await this.userService.findAll();

    return users;
  }
}