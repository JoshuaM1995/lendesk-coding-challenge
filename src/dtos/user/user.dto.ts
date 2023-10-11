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
  // Ensure the password isn't sent in a JSON response
  @Expose({ toClassOnly: true })
  public readonly password: string;
}
