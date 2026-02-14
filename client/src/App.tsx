import { Routes, Route } from "react-router"
import { Dashboard } from "./pages/Dashboard"
import { AppLayout } from "./layouts/AppLayout"
import { Wallets } from "./pages/Wallets"
import { Wallet } from "./pages/Wallet"
import { Settings } from "./pages/Settings"

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="wallets" element={<Wallets />} />
          <Route path="wallets/:id" element={<Wallet />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
