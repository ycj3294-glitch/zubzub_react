import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GetList from "./page/List";
import ComponentTest from "./pages/ComponentTest";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/component-test" element={<ComponentTest />}></Route>
        </Routes>
      </Router>
      <GetList />
    </>
  );
}

export default App;
