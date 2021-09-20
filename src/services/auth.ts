import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

const tokenKey: string = config.get('App.auth.key');
const tokenExpiresIn: number = config.get('App.auth.tokenExpiresIn');

export interface JwtToken {
  sub: string;
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(sub: string): string {
    return jwt.sign({ sub }, tokenKey, {
      expiresIn: tokenExpiresIn,
    });
  }

  public static decodeToken(token: string): JwtToken {
    return jwt.verify(token, tokenKey) as JwtToken;
  }
}
