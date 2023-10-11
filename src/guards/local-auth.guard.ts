import type { ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const canActivate = super.canActivate(context);

    if (typeof canActivate === 'boolean') {
      if (!super.canActivate) {
        throw new UnauthorizedException('Username or password incorrect');
      }

      return canActivate;
    }

    if (canActivate instanceof Observable) {
      return canActivate;
    }

    if ('then' in Promise.resolve(canActivate)) {
      return canActivate.catch(() => {
        throw new UnauthorizedException('Username or password incorrect');
      });
    }

    return canActivate;
  }
}
