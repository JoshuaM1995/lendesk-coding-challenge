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
    userService = app.get(UserService);
  });

  describe('POST /auth/register', () => {
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

    it('should return a 400 when the username is too short', async () => {
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

    it('should return a 400 when the username is too long', async () => {
      const mockUsername = faker.word.words(21);
      const mockPassword = 'Password123!';

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: mockUsername,
          password: mockPassword,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return a 400 when the password strength requirements aren't met", async () => {
      const mockUsername = faker.word.words(15);
      const mockPassword = 'password';

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

  describe('POST /auth/login', () => {
    it('should allow a user to login when the username and password are valid', async () => {
      const mockUsername = faker.internet.userName();
      const mockPassword = 'Password123!';

      // Make sure the user is found so the local strategy can validate the password
      jest.spyOn(userService, 'findByUsername').mockReturnValue(
        Promise.resolve({
          id: uuidv4(),
          username: mockUsername,
          password: mockPassword,
        }),
      );

      // Make sure the password is valid in the local strategy
      jest
        .spyOn(userService, 'validatePassword')
        .mockReturnValue(Promise.resolve(true));

      const { body } = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: mockUsername,
          password: mockPassword,
        })
        .expect(HttpStatus.OK);

      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
    });

    it("should return a 401 when the user doesn't exist", async () => {
      const mockUsername = faker.internet.userName();
      const mockPassword = 'Password123!';

      // Mock a user not being found without actually searching for them in Redis
      jest
        .spyOn(userService, 'findByUsername')
        .mockReturnValue(Promise.resolve(undefined));

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: mockUsername,
          password: mockPassword,
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should return a 401 when the user's password is invalid", async () => {
      const mockUsername = faker.internet.userName();
      const mockPassword = 'Password123!';

      // Make sure the password is invalid in the local strategy
      jest
        .spyOn(userService, 'validatePassword')
        .mockReturnValue(Promise.resolve(false));

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: mockUsername,
          password: mockPassword,
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
