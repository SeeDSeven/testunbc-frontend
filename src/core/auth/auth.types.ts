import { User } from "../user/user.types";

export interface LoginRequest {
  username: string;
  password: string;
  grant_type: string;
  client_id: number;
  client_secret: string;
  scope: string;
}


export interface LoginResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface AuthenticationResult {
    AccessToken: string;
    ExpiresIn: number;
    IdToken: string;
    NewDeviceMetadata: any;
    RefreshToken: string;
    TokenType: string;
}
