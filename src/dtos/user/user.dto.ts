import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserDTO {
  @ApiProperty({ example: 'johndoe' })
  public readonly username: string;

  @ApiProperty({ example: 'Password123!' })
  @Exclude({ toClassOnly: true })
  public readonly password: string;
}
