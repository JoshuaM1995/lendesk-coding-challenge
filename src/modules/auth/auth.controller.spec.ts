import { faker } from '@faker-js/faker';
import { UserService } from '@modules/user';
import {
  HttpStatus,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { setupTests } from '@utils/setup-tests';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let app: INestApplication;
  let userService: UserService;
  let authService: AuthService;

  beforeAll(async () => {
    app = await setupTests();
    userService = app.get(UserService);
    authService = app.get(AuthService);
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
    it("should return a 401 when the user isn't found", async () => {
      const mockUsername = faker.internet.userName();
      const mockPassword = 'Password123!';

      // Ensure the local strategy throws an error when searching for a user
      jest.spyOn(authService, 'validateUser').mockImplementation(() => {
        throw new UnauthorizedException(`Invalid username or password`);
      });

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
