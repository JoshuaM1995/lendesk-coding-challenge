import { BCRYPT_ROUNDS } from '@constants/bcrypt';
import { CreateUserDTO, UserDTO } from '@dtos/user';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  public async create({ username, password }: CreateUserDTO): Promise<number> {
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

  public async findById(id: string): Promise<UserDTO | undefined> {
    const users = await this.findAll();

    return users.find((user) => user.id === id);
  }

  public async findByUsername(username: string): Promise<UserDTO | undefined> {
    const users = await this.findAll();

    return users.find((user) => user.username === username);
  }

  public async findAll(): Promise<UserDTO[]> {
    const userJSONStrings = await this.redis.lrange('users', 0, -1);

    return userJSONStrings.map((json) =>
      plainToInstance(UserDTO, JSON.parse(json)),
    );
  }

  public async validatePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
