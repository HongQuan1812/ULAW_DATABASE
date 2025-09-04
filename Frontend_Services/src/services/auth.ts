import request from '@/utils/request';
import api from '../apiEndpoint/index';

export const endpoint = api.UMI_API_BASE_URL;

/**
 * request to login
 * @param {string} data.username
 * @param {string} data.password
 * @returns {Promise<object>}
 */

export interface UserInfoResponse {
  code: number;
  message: string;
  data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    cccdNumber: string;
    dateOfBirth: string;
    ethnic: string;
    gender: string;
    contactAddress: string;
    permanentAddress: string;
    studentContactProvince: string;
    studentContactWard: string;
    studentAvatar: string;
    role: string;
  };
}

export interface requestProps {
  success: boolean;
  error_code: number;
  length_data: number;
  message_error: string;
}

export interface requeGetUrlSSOProps extends requestProps {
  username: string;
  email: string;
  token: string;
}

export interface requestRegisterProps extends requestProps {
  fullName: string;
  phoneNumber: string;
  username: string;
  email: string;
}

interface requestVerifySSO extends requestProps {
  data: Array<{
    token: string;
  }>;
}

export interface LoginResponse {
  message: string;
  code: number;
  data: {
    username: string;
    email: string;
    token: string;
    firstName?: string;
    lastName?: string;
  };
}

export const getUrlSSO = (
  usernameValue: string,
  passwordValue: string,
): Promise<requeGetUrlSSOProps> => {
  return request(`${endpoint}/api/account/user/login`, {
    method: 'POST',
    data: {
      username: usernameValue,
      password: passwordValue,
    },
  });
};

export async function verifySSO(data: any): Promise<requestVerifySSO> {
  return request(`${endpoint}/api/account/user/login`, {
    method: 'POST',
    data,
  });
}

////////////////////////////////////////////////////////////
export async function requestRegister(data: {
  username: string;
  email: string;
  password: string;
  fristName: string;
  lastName: string;
  phoneNumber?: string;
}) {
  return request(`${endpoint}/api/account/register`, {
    method: 'POST',
    data: data,
  });
}

export async function requestLogin(username: string, password: string) {
  return request(`${endpoint}/api/account/login`, {
    method: 'POST',
    data: { username, password },
  });
}

export async function requestResetPassword(data: {
  username: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) {
  return request(`${endpoint}/api/account/change-password`, {
    method: 'POST',
    data: data,
  });
}

export async function requestForgotPassword(email: string) {
  return request(`${endpoint}/api/account/forgot-password`, {
    method: 'POST',
    data: { email },
  });
}

export async function fetchUserInfo(usertoken: any): Promise<UserInfoResponse> {
  return request<UserInfoResponse>(`${endpoint}/api/account/info`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${usertoken}`,
    },
  });
}
///////////////////////////////////////////////////////////////
/**
 * Request to refresh token
 * @param {string} data.refreshToken
 * @returns {Promise<object>}
 */
export async function requestRefreshToken(refreshToken: string): Promise<any> {
  return request(`${endpoint}/auth-service/api/get_token_from_refresh_token`, {
    method: 'POST',
    data: {
      refresh_token: refreshToken,
      redirect_uri: api.UMI_API_URL,
    },
  });
}
