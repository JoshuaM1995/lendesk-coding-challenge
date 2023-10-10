import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({ example: 'johndoe' })
  public readonly username: string;

  @IsString()
  @ApiProperty({ example: 'Password123!' })
  public readonly password: string;
}
