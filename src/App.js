import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import Main from "./pages/Main";
import Layout from "./components/Layout";
import MajorAuction from "./pages/MajorAuction";
import MinorAuction from "./pages/MinorAuction";
import MinorAuctionDetail from "./pages/MinorAuctionDetail";
import MajorAuctionDetail from "./pages/MajorAuctionDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Main />} />
            <Route path="/auction/minor" element={<MinorAuction />} />
            <Route path="/auction/major" element={<MajorAuction />} />
            <Route path="/auction/minor/:id" element={<MinorAuctionDetail />} />
            <Route path="/auction/major/:id" element={<MajorAuctionDetail />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
