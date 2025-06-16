import type {
  CreateRequest,
  CreateResponse,
  FindAllRequest,
  FindAllResponse,
  FindRequest,
  FindResponse,
  LoginRequest,
  LoginResponse,
  RemoveRequest,
  RemoveResponse,
  UpdateRequest,
  UpdateResponse,
} from './users.type'

import { fetchPost } from '~/utils/fetch'

export async function login(data: LoginRequest) {
  const result = await fetchPost<LoginResponse>('/api/auth/login', JSON.stringify(data))

  return result
}

export async function create(data: CreateRequest) {
  const result = await fetchPost<CreateResponse>('/api/user/create', JSON.stringify(data))

  return result
}

export async function find(data?: FindRequest) {
  const result = await fetchPost<FindResponse>('/api/user/find', JSON.stringify(data))

  return result
}

export async function findAll(data: FindAllRequest) {
  const result = await fetchPost<FindAllResponse>('/api/user/find-all', JSON.stringify(data))

  return result
}

export async function update(data: UpdateRequest) {
  const result = await fetchPost<UpdateResponse>('/api/user/update', JSON.stringify(data))

  return result
}

export async function remove(data: RemoveRequest) {
  const result = await fetchPost<RemoveResponse>('/api/user/remove', JSON.stringify(data))

  return result
}
