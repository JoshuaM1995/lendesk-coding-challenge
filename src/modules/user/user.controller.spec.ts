import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { setupTests } from '@utils/setup-tests';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './user.service';

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;
  let accessToken: string;

  beforeAll(async () => {
    const {
      app: application,
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    } = await setupTests();

    app = application;
    userService = app.get(UserService);
    accessToken = mockAccessToken;
  });

  describe('GET /users', () => {
    it('should return all users when they exist', async () => {
      const mockId = uuidv4();
      const mockUsername = faker.internet.userName();
      const mockPassword = 'Password123!';

      // Make sure a user is returned in the refresh token strategy
      jest.spyOn(userService, 'findById').mockResolvedValue({
        id: uuidv4(),
        username: mockUsername,
        password: mockPassword,
      });

      // Make sure users are returned in the /users endpoint
      jest.spyOn(userService, 'findAll').mockResolvedValue([
        {
          id: mockId,
          username: mockUsername,
          password: mockPassword,
        },
      ]);

      const { body } = await request(app.getHttpServer())
        .get('/users')
        .auth(accessToken, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(body[0].id).toBe(mockId);
      expect(body[0].username).toBe(mockUsername);
      expect(body[0].password).toBeUndefined();
    });

    it("should return a 401 when the user isn't authenticated", async () => {
      const mockUsername = faker.internet.userName();
      const mockPassword = 'Password123!';

      // Make sure a user is returned in the refresh token strategy
      jest.spyOn(userService, 'findById').mockResolvedValue({
        id: uuidv4(),
        username: mockUsername,
        password: mockPassword,
      });

      await request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
