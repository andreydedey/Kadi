import { Routes, Route, Navigate, Outlet } from "react-router"
import { Dashboard } from "./pages/Dashboard"
import { AppLayout } from "./layouts/AppLayout"
import { Wallets } from "./pages/Wallets"
import { WalletPage } from "./pages/Wallet"
import { Settings } from "./pages/Settings"
import { Categories } from "./pages/Categories"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { useAuth } from "./contexts/AuthContext"

function ProtectedRoute() {
  const { authenticated, loading } = useAuth()
  if (loading) return null
  return authenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function PublicRoute() {
  const { authenticated, loading } = useAuth()
  if (loading) return null
  return authenticated ? <Navigate to="/home" replace /> : <Outlet />
}

function RootRedirect() {
  const { authenticated, loading } = useAuth()
  if (loading) return null
  return <Navigate to={authenticated ? "/home" : "/login"} replace />
}

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route element={<PublicRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="home" index element={<Dashboard />} />
            <Route path="wallets" element={<Wallets />} />
            <Route path="wallets/:id" element={<WalletPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="categories" element={<Categories />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
