import { INestApplication } from '@nestjs/common';
import { UserService } from './user.service';
import { setupTests } from '@utils/setup-tests';

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const { app: application, accessToken, refreshToken } = await setupTests();

    app = application;
    userService = app.get(UserService);
  });

  describe('GET /users', () => {
    it('should return all users when they exist', async () => {});

    it("should return a 401 when the user isn't authenticated", async () => {});
  });
});
