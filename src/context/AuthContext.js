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
    localStorage.removeItem("accessToken");
    setAccessToken(null);
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
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  useEffect(() => {
    // 항상 최신 토큰을 localStorage에서 읽어오기
    AxiosAPI.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    AxiosAPI.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // refresh API는 인터셉터 제외
        if (originalRequest.url.includes("/refresh")) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log("토큰재발행");
            const res = await AxiosAPI.refresh();
            const newToken = res.data;

            setAccessToken(newToken);
            localStorage.setItem("accessToken", newToken);
            console.log("스토리지에 새 액세스토큰 저장", newToken);

            // 원래 요청 재실행 (request 인터셉터가 최신 토큰을 자동으로 넣음)
            return AxiosAPI(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }, []);

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
