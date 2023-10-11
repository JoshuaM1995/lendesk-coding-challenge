import { AppModule } from '@modules/app';
import { Test } from '@nestjs/testing';
import { setupApp } from './setup-app';

export const setupTests = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();

  setupApp(app);

  await app.init();

  return app;
};
