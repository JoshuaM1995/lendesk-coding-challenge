import { CreateUserDTO, UserDTO } from '@dtos/user';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import Redis from 'ioredis';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class UserService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public async create({ username, password }: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    return this.redis.rpush(
      'users',
      JSON.stringify({
        id: uuidv4(),
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

  public async validatePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
