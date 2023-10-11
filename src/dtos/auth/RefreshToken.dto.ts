import { Expose } from 'class-transformer';

export class RefreshTokenDTO {
  @Expose()
  accessToken!: string;

  @Expose()
  refreshToken!: string;
}
