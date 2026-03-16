import { Routes, Route } from "react-router"
import { Dashboard } from "./pages/Dashboard"
import { AppLayout } from "./layouts/AppLayout"
import { Wallets } from "./pages/Wallets"
import { Wallet } from "./pages/Wallet"
import { Settings } from "./pages/Settings"
import { Categories } from "./pages/Categories"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route element={<AppLayout />}>
          <Route path="home" index element={<Dashboard />} />
          <Route path="wallets" element={<Wallets />} />
          <Route path="wallets/:id" element={<Wallet />} />
          <Route path="settings" element={<Settings />} />
          <Route path="categories" element={<Categories />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
