import { User } from '@src/models/user';
import AuthService from '@src/services/auth';

describe('Users functional tests', () => {
  beforeEach(async () => await User.deleteMany());
  describe('Creating a new user', () => {
    it('Return successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '12345',
      };
      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePassword(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    });

    it('Return 400 when there is as validation error', async () => {
      const newUser = {
        email: 'joe@mail.com',
        password: '12345',
      };
      const response = await global.testRequest.post('/users').send(newUser);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: 'Bad Request',
        message: 'User validation failed: name: Path `name` is required.',
      });
    });
  });

  describe('Authenticate a user', () => {
    it('Generate a token for a valid user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: '1234',
      };
      const user = await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({ email: newUser.email, password: newUser.password });
      const JwtClaims = AuthService.decodeToken(response.body.token);
      expect(JwtClaims).toMatchObject({ sub: user.id });
    });

    it('Return UNAUTHORIZED if the user with the given email is not found', async () => {
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({
          email: 'jane@mail.com',
          password: '1234',
        });
      expect(response.status).toBe(401);
    });

    it('Return UNAUTHORIZED if the user is found but the password does not match', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: '1234',
      };
      await new User(newUser).save();
      const response = await global.testRequest
        .post('/users/authenticate')
        .send({
          email: 'johndoe@mail.com',
          password: 'diferentPassword',
        });
      expect(response.status).toBe(401);
    });
  });

  describe('Getting user profile info', () => {
    it(`Return the token's owner profile information`, async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@mail.com',
        password: '1234',
      };
      const user = await new User(newUser).save();
      const token = AuthService.generateToken(user.id);
      const { body, status } = await global.testRequest
        .get('/users/me')
        .set({ 'x-access-token': token });

      expect(status).toBe(200);
      expect(body).toMatchObject(JSON.parse(JSON.stringify({ user })));
    });

    it(`Return Not Found, when the user is not found`, async () => {
      const token = AuthService.generateToken('fake-user-id');
      const { body, status } = await global.testRequest
        .get('/users/me')
        .set({ 'x-access-token': token });

      expect(status).toBe(404);
      expect(body.message).toBe('User not found!');
    });
  });
});
