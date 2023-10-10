import { CreateUserDTO } from '@dtos/user';
import { UserService } from '@modules/user/user.service';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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

  public async login() {
    return 'Login';
  }
}
