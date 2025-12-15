import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainAuction from "./pages/MainAuction";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main-auction/:id" element={<MainAuction />}></Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
