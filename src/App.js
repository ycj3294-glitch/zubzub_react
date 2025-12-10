import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainAuction from "./pages/MainAuction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main-auction" element={<MainAuction />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
