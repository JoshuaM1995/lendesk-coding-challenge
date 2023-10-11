import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDTO {
  @ApiProperty({ example: 'd09b8e50-178e-4899-b973-5b4056917a6c' })
  @Expose()
  public readonly id: string;

  @ApiProperty({ example: 'johndoe' })
  @Expose()
  public readonly username: string;

  @ApiProperty({ example: 'Password123!' })
  public readonly password: string;
}
