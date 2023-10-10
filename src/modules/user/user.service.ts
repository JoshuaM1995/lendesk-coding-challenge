import { CreateUserDTO, UserDTO } from '@dtos/user';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import Redis from 'ioredis';

@Injectable()
export class UserService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public async create(user: CreateUserDTO) {
    return this.redis.rpush('users', JSON.stringify(user));
  }

  public async findByUsername(username: string) {
    const userJSONStrings = await this.redis.lrange('users', 0, -1);
    const users = userJSONStrings.map((json) =>
      plainToInstance(UserDTO, JSON.parse(json)),
    );

    console.log('findByUsername', users);

    return users.find((user) => user.username === username);
  }
}
