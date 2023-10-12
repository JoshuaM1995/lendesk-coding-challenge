import type { UserDTO } from '@dtos/user';
import type { Request } from 'express';

export interface JWTUser {
  id: number;
  username: string;
}

export interface RequestWithUser<T = undefined> extends Request {
  user: UserDTO & T;
}

export interface RequestWithJWTUser<T = undefined> extends Request {
  user: JWTUser & T;
}

export type RequestWithUserAndJWT = RequestWithUser<{
  accessToken: string;
  refreshToken: string;
}>;
