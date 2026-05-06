import { api } from "./api"
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "./types"

export async function login({ email, password }: LoginRequest) {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  })
  localStorage.setItem("token", data.token)
  return data.token
}

export async function register({ username, email, password }: RegisterRequest) {
  const { data } = await api.post<AuthResponse>("/auth/register", {
    username,
    email,
    password
  })
  localStorage.setItem("token", data.token)
  return data.token
}

export function logout() {
  localStorage.removeItem("token")
}

export function getToken() {
  return localStorage.getItem("token")
}

export function isAuthenticated() {
  return !!getToken()
}

export async function me() {
  const { data } = await api.get<User>("/auth/me")
  return data
}

export interface UpdateProfileRequest {
  username: string
  defaultCurrency?: string
}

export interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

export async function updateProfile(body: UpdateProfileRequest): Promise<User> {
  const { data } = await api.put<User>("/auth/profile", body)
  return data
}

export async function updatePassword(body: UpdatePasswordRequest): Promise<void> {
  await api.put("/auth/profile/password", body)
}

export async function deleteAccount(): Promise<void> {
  await api.delete("/auth/me")
}
