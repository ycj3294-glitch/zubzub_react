// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import AxiosAPI from "../api/AxiosAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  const login = ({ accessToken, ...userData }) => {
    setIsLogin(true);
    setUser(userData);
    setAccessToken(accessToken);
  };

  const logout = () => {
    setIsLogin(false);
    setUser(null);
    setAccessToken(null);
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await AxiosAPI.refresh();
        if (res.status === 200 || res.status === 201) {
          const { accessToken, refreshToken, ...userData } = res.data;
          console.log("이건로그인시응답 : ", res.data);
          console.log("유저데이터 : ", userData);
          console.log("액세스토큰 : ", accessToken);
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

  useEffect(() => {
    if (accessToken) {
      AxiosAPI.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      });
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ isLogin, user, login, logout, loading, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
