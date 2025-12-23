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
import MyPage from "./pages/MyPage";
import Notice from "./pages/Notice";
import ComponentTest from "./pages/ComponentTest";
import AdminPage from "./pages/AdminPage";
import AuctionSchedule from "./pages/AuctionSchedule";
import CreateAuction from "./pages/CreateAuction";
import ScrollToTop from "./components/common/ScrollToTop";
import MyPageEdit from "./pages/MyPageEdit";
import MySales from "./pages/MySales";
import AuctionHistory from "./pages/AuctionHistory";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/auction-history" element={<AuctionHistory />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Main />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/auction/minor" element={<MinorAuction />} />
            <Route path="/auction/major" element={<MajorAuction />} />
            <Route path="/auction/minor/:id" element={<MinorAuctionDetail />} />
            <Route path="/auction/major/:id" element={<MajorAuctionDetail />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/component-test" element={<ComponentTest />} />
            <Route path="/schedule" element={<AuctionSchedule />} />
            <Route path="/create-auction" element={<CreateAuction />} />
            <Route path="/mypage-edit" element={<MyPageEdit />} />
            <Route path="/mypage/sales" element={<MySales />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
