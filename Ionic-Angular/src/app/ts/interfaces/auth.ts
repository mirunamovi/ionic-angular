import { UserInterface } from './user';

export interface TokensInterface {
  accessToken: string;
  refreshToken: string;
}

export interface CredentialsInterface extends TokensInterface {
  user: UserInterface;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface SignUpInterface{
  name: string;
  email: string;
  password: string
}

export interface ResetInterface{
  email: string | null;
  password: string
}
