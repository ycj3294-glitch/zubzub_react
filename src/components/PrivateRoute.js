import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLogin, loading } = useAuth();

  if (loading) return <div>로딩중...</div>;

  return isLogin ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
