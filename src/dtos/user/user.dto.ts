import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserDTO {
  @ApiProperty({ example: 'd09b8e50-178e-4899-b973-5b4056917a6c' })
  public readonly id: string;

  @ApiProperty({ example: 'johndoe' })
  public readonly username: string;

  @ApiProperty({ example: 'Password123!' })
  @Exclude({ toPlainOnly: true })
  public readonly password: string;
}
