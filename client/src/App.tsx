import { Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { AppLayout } from "./layouts/AppLayout";

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />}></Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
