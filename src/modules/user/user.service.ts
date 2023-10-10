import { CreateUserDTO, UserDTO } from '@dtos/user';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import Redis from 'ioredis';
import * as bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UserService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public async create({ username, password }: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    return this.redis.rpush(
      'users',
      JSON.stringify({
        username,
        password: hashedPassword,
      }),
    );
  }

  public async findByUsername(username: string) {
    const userJSONStrings = await this.redis.lrange('users', 0, -1);
    const users = userJSONStrings.map((json) =>
      plainToInstance(UserDTO, JSON.parse(json)),
    );

    return users.find((user) => user.username === username);
  }
}
