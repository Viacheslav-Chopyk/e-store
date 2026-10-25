export interface IUser {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  role: ERoles
}

export interface IAuthResponse {
  accessToken: string;
  user: IUser;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest extends ILoginRequest {
  name: string;
}

export enum ERoles {
  Admin = 'admin',
  User = 'user',
}
