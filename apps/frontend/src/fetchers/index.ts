import type { GetCurrentUserInfoResponse, GetUserListRequest, GetUserListResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UpdateUserRequest, UpdateUserResponse } from './type'

import { fetchGet, fetchPost } from '~/utils/fetch'

export async function login(data: LoginRequest) {
  const result = await fetchPost<LoginResponse>('/api/auth/login', JSON.stringify(data))

  return result
}

export async function register(data: RegisterRequest) {
  const result = await fetchPost<RegisterResponse>('/api/user/register', JSON.stringify(data))

  return result
}

export async function getCurrentUserInfo() {
  const result = await fetchGet<GetCurrentUserInfoResponse>('/api/user')

  return result
}

export async function getUserList(data: GetUserListRequest) {
  const result = await fetchPost<GetUserListResponse>('/api/user/page', JSON.stringify(data))

  return result
}

export async function updateUser(data: UpdateUserRequest) {
  const result = await fetchPost<UpdateUserResponse>('/api/user/update', JSON.stringify(data))

  return result
}
