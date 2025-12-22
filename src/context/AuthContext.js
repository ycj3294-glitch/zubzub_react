// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import AxiosAPI from "../api/AxiosAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  const login = (userData) => {
    setIsLogin(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLogin(false);
    setUser(null);
  };

  const checkLogin = async () => {
    try {
      const res = await AxiosAPI.me();
      login(res.data);
      console.log("로그인됨", res.data);
    } catch (e) {
      console.log("not logged in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      console.log("스토리지에 액세스토큰 저장", accessToken);

      AxiosAPI.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      });

      AxiosAPI.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const res = await AxiosAPI.refresh();
              const { accessToken } = res.data;
              setAccessToken(accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return AxiosAPI(originalRequest); // 실패했던 요청 재시도
            } catch (err) {
              logout();
              return Promise.reject(err);
            }
          }
          return Promise.reject(error);
        }
      );
    } else localStorage.removeItem("accessToken", null);
  }, [accessToken]);

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        user,
        login,
        checkLogin,
        logout,
        loading,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
