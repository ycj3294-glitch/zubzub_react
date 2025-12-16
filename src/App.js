import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainAuction from "./pages/MainAuction";
import ComponentTest from "./pages/ComponentTest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main-auctions/:id" element={<MainAuction />}></Route>
        <Route path="/component-test" element={<ComponentTest />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
