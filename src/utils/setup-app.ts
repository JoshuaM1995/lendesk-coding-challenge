import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';

export const setupApp = (app: INestApplication) => {
  const reflector = app.get('Reflector');

  app.enableCors({ origin: '*' });
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  // Add JWT bearer authentication to all routes by default
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      // Exclude all properties by default in case we forget to use the @Exclude() decorator on sensitive fields
      strategy: 'excludeAll',
    }),
  );
};
