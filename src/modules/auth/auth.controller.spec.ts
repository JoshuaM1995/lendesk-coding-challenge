import { faker } from '@faker-js/faker';
import { UserService } from '@modules/user';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { setupTests } from '@utils/setup-tests';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';

describe('AuthController', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    app = await setupTests();
    userService = app.get<UserService>(UserService);
  });

  describe('POST /register', () => {
    it("should create a user when the username and password requirements are met, and the user doesn't exist", async () => {
      const mockUsername = faker.internet.userName();
      const mockPassword = 'Password123!';

      // Mock a user not being found without actually searching for them in Redis
      jest
        .spyOn(userService, 'findByUsername')
        .mockReturnValue(Promise.resolve(undefined));

      // Mock a user being created without actually creating them in Redis
      jest.spyOn(userService, 'create').mockReturnValue(Promise.resolve(1));

      const { body } = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: mockUsername,
          password: mockPassword,
        })
        .expect(HttpStatus.CREATED);

      expect(body.username).toBe(mockUsername);
      expect(body.password).toBeUndefined();
    });

    it("should return a 400 when the username requirements aren't met", async () => {
      const mockUsername = 'a';
      const mockPassword = 'Password123!';

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: mockUsername,
          password: mockPassword,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return a 400 when the username is already taken', async () => {
      const mockUsername = faker.internet.userName();
      const mockPassword = 'Password123!';

      // Mock a user not being found without actually searching for them in Redis
      jest.spyOn(userService, 'findByUsername').mockReturnValue(
        Promise.resolve({
          id: uuidv4(),
          username: mockUsername,
          password: mockPassword,
        }),
      );

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: mockUsername,
          password: mockPassword,
        })
        .expect(HttpStatus.CONFLICT);
    });
  });
});
