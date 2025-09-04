import api from '../apiEndpoint/index';
import request from '@/utils/request';
export const endpoint = api.UMI_API_BASE_URL;

export interface ProvinceNameData {
  code: number;
  message: string;
  data: {
    provinceName: string;
    wardName: string;
  };
}

export interface AvatarUrlProps {
  message: string;
  url: string;
}

export interface UserRegisInfo {
  code: number;
  message: string;
  data: {
    enrollmenCode: string;
    trainingSystemType: string;
    regisDate: string;
  };
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  pagination?: PaginationMetaData;
}

export interface PaginationMetaData {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface AllUserInfo {
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
}

export interface GetUserByRoleRequest {
  role?: string;
  pageNumber?: number;
  pageSize?: number;
  sortOrder?: 'ascending' | 'descending';
  searchQuery?: string;
}

export type GetUserByRoleResponse = ApiResponse<AllUserInfo[]>;

export async function getProvinceNameByCode(provinceCode: string, wardCode: string) {
  return request(`${endpoint}/api/province/name-by-code`, {
    method: 'GET',
    params: {
      provinceCode,
      wardCode,
    },
  });
}

export async function getUserAvatarUrl(formCode: string) {
  return request(`${endpoint}/api/Enrollment/get-avatar`, {
    method: 'GET',
  });
}

export async function fetchUserRegisInfo(userToken: any) {
  return request(`${endpoint}/api/enrollment/regis-info`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });
}

export async function getUsersListByRole(
  params: GetUserByRoleRequest,
  options?: { [key: string]: any },
): Promise<GetUserByRoleResponse> {
  const defaultParams = {
    pageNumber: 1,
    pageSize: 10,
    sortOrder: 'ascending',
    ...params,
  };

  return request<GetUserByRoleResponse>(`${endpoint}/api/account/users-by-role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    data: defaultParams,
    ...(options || {}),
  });
}
