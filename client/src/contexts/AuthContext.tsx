import { isAuthenticated } from "@/services/auth"
import { createContext, useContext, useState, type ReactNode } from "react"
import { logout as logoutService } from "@/services/auth"

interface AuthContextType {
  authenticated: boolean
  setAuthenticated: (value: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated())

  const logout = () => {
    logoutService()
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated, logout }}>
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
