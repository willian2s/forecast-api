import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { User } from '@src/models/user';

const tokenKey: string = config.get('App.auth.key');
const tokenExpiresIn: number = config.get('App.auth.tokenExpiresIn');

export interface DecodedUser extends Omit<User, '_id'> {
  id: string;
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

  public static generateToken(payload: User): string {
    return jwt.sign(payload, tokenKey, {
      expiresIn: tokenExpiresIn,
    });
  }

  public static decodeToken(token: string): DecodedUser {
    return jwt.verify(token, tokenKey) as DecodedUser;
  }
}
