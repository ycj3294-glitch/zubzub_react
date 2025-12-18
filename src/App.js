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
import AdminPage from "./pages/AdminPage";
import AuctionSchedule from "./pages/AuctionSchedule";
import CreateAuction from "./pages/CreateAuction";

// ✅ 경로 수정 완료: src/components/common/PrivateRoute.js
import PrivateRoute from "./components/PrivateRoute";

// ✅ 경로 수정 완료: src/pages/MyProfileEdit.js
import MyProfileEdit from "./pages/MyProfileEdit";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 마이페이지 관련 */}
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/edit-profile" element={<MyProfileEdit />} />

            {/* 경매 관련 */}
            <Route path="/auction/minor" element={<MinorAuction />} />
            <Route path="/auction/major" element={<MajorAuction />} />
            <Route path="/auction/minor/:id" element={<MinorAuctionDetail />} />
            <Route path="/auction/major/:id" element={<MajorAuctionDetail />} />

            <Route path="/notice" element={<Notice />} />
            <Route path="/schedule" element={<AuctionSchedule />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/create-auction" element={<CreateAuction />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
