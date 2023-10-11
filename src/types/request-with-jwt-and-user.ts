import type { UserDTO } from '@dtos/user';
import type { Request } from 'express';

export interface JWTUser {
  id: number;
  username: string;
}

export interface RequestWithUser<T = unknown> extends Request {
  user: UserDTO & T;
}

export interface RequestWithJWTUser<T = unknown> extends Request {
  user: JWTUser & T;
}

export type RequestWithUserAndJWT = RequestWithUser<{
  accessToken: string;
  refreshToken: string;
}>;
