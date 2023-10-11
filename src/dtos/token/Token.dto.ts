import { Expose } from 'class-transformer';

export class TokenDTO {
  @Expose()
  jwt: string;

  @Expose()
  refreshToken: string;
}
