import { Routes, Route } from "react-router";
import { Home } from "./pages/Home";

const App = () => {
  return (
    <>
      <Routes>
        <Route index element={<Home />}></Route>
      </Routes>
    </>
  );
};

export default App;
