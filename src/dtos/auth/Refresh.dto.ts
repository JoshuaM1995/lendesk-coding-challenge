import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshDTO {
  @IsJWT()
  @ApiProperty({
    name: 'refreshToken',
    example: 'refreshToken',
  })
  refreshToken: string;
}
