// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import AxiosAPI from "../api/AxiosAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (newToken, userData) => {
    setToken(newToken);
    setIsLogin(true);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setIsLogin(false);
    setUser(null);
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await AxiosAPI.me(token);
        if (res.status === 200 || res.status === 201) {
          login(token, res.data);
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
