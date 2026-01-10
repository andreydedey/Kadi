import { Routes, Route } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { AppLayout } from "./layouts/AppLayout";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />}></Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
