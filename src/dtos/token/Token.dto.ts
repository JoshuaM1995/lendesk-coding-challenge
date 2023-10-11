import { Expose } from 'class-transformer';

export class TokenDTO {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
