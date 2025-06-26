import type {
  UserCreateRequest,
  UserCreateResponse,
  UserFindAllRequest,
  UserFindAllResponse,
  UserFindRequest,
  UserFindResponse,
  UserLoginRequest,
  UserLoginResponse,
  UserRemoveRequest,
  UserRemoveResponse,
  UserSwitchRequest,
  UserSwitchResponse,
  UserUpdateRequest,
  UserUpdateResponse,
} from './users.type'

import { fetchPost } from '~/utils/fetch'

export async function userLogin(data: UserLoginRequest) {
  const result = await fetchPost<UserLoginResponse>('/api/auth/login', JSON.stringify(data))

  return result
}

export async function userCreate(data: UserCreateRequest) {
  const result = await fetchPost<UserCreateResponse>('/api/user/create', JSON.stringify(data))

  return result
}

export async function userSwitch(data: UserSwitchRequest) {
  const result = await fetchPost<UserSwitchResponse>('/api/user/switch', JSON.stringify(data))

  return result
}

export async function userUpdate(data: UserUpdateRequest) {
  const result = await fetchPost<UserUpdateResponse>('/api/user/update', JSON.stringify(data))

  return result
}

export async function userRemove(data: UserRemoveRequest) {
  const result = await fetchPost<UserRemoveResponse>('/api/user/remove', JSON.stringify(data))

  return result
}

export async function userFind(data?: UserFindRequest) {
  const result = await fetchPost<UserFindResponse>('/api/user/find', JSON.stringify(data))

  return result
}

export async function userFindAll(data: UserFindAllRequest) {
  const result = await fetchPost<UserFindAllResponse>('/api/user/find-all', JSON.stringify(data))

  return result
}
