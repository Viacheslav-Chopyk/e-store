export interface IUser {
  id: number;
  email: string;
  name: string;
  createdAt: string;
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
