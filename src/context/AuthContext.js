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
    // 1. Request Interceptor: 모든 요청에 토큰 주입
    const requestInterceptor = AxiosAPI.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 2. Response Interceptor: 401 에러 시 토큰 재발행 로직
    const responseInterceptor = AxiosAPI.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // [중요 수정]
        // 1. refresh API 호출 중 에러는 즉시 거부
        // 2. login API 호출 중 401 에러는 '비번 틀림'이지 '토큰 만료'가 아니므로 재발행 로직 방지
        if (
          originalRequest.url.includes("/refresh") ||
          originalRequest.url.includes("/login")
        ) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log("토큰재발행 시도 중...");
            const res = await AxiosAPI.refresh();
            const newToken = res.data;

            setAccessToken(newToken);
            localStorage.setItem("accessToken", newToken);
            console.log("스토리지에 새 액세스토큰 저장 완료");

            // 새 토큰으로 헤더 교체 후 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return AxiosAPI(originalRequest);
          } catch (refreshError) {
            console.error("토큰 재발행 실패 -> 로그아웃 처리");
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // 컴포넌트 언마운트 시 인터셉터 정리
    return () => {
      AxiosAPI.interceptors.request.eject(requestInterceptor);
      AxiosAPI.interceptors.response.eject(responseInterceptor);
    };
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
