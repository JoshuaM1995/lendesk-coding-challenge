import { faker } from '@faker-js/faker';
import { AppModule } from '@modules/app';
import { AuthService } from '@modules/auth';
import { Test } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { setupApp } from './setup-app';

export const setupTests = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  const authService = app.get(AuthService);

  const { accessToken, refreshToken } = await authService.getTokens({
    sub: uuidv4(),
    username: faker.internet.userName(),
  });

  setupApp(app);

  await app.init();

  return { app, accessToken, refreshToken };
};
