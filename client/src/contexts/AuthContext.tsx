import { isAuthenticated, me, logout as logoutService } from "@/services/auth"
import type { UserDTO } from "@/services/types"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface AuthContextType {
  authenticated: boolean
  user: UserDTO | null
  loading: boolean
  setAuthenticated: (value: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<UserDTO | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false)
      return
    }

    me()
      .then((data) => {
        setUser(data)
        setAuthenticated(true)
        setLoading(false)
      })
      .catch((error) => {
        // sem resposta do servidor = backend fora: confia no token local
        // qualquer resposta HTTP (401, 500, etc.) = token inválido ou erro real
        if (!error?.response) {
          setAuthenticated(true)
        }
        setLoading(false)
      })
  }, [])

  const logout = () => {
    logoutService()
    setUser(null)
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ authenticated, user, loading, setAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
