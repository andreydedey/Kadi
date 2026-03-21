import { api } from "./api"
import type { AuthResponse, LoginRequest, RegisterRequest, UserDTO } from "./types"

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
  const { data } = await api.get<UserDTO>("/auth/me")
  return data
}
