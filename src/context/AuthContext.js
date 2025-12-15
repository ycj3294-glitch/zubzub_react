// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import AxiosAPI from "../api/AxiosAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setIsLogin(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLogin(false);
    setUser(null);
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await AxiosAPI.me();
        if (res.data) {
          login(res.data);
        }
      } catch (e) {
        console.log("not logged in");
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
