import { createContext, useContext, useState, useEffect } from "react";
import AxiosAPI from "../api/AxiosAPI";

const AuthContext = createContext();

/**
 * 토큰의 Payload에서 Role을 꺼내 ADMIN 여부를 확인하는 헬퍼 함수
 */
const getIsAdminFromToken = (token) => {
  if (!token) return false;
  try {
    const base64Payload = token.split(".")[1];
    // Base64 디코딩 후 JSON 파싱
    const payload = JSON.parse(atob(base64Payload));
    // 백엔드 JwtUtil에서 넣어주는 "role" 클레임 확인
    return payload.role === "ADMIN";
  } catch (e) {
    console.error("Token decoding error:", e);
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  // 로그인 처리 (userData에 isAdmin 권한을 강제로 합침)
  const login = (userData, token = null) => {
    const currentToken = token || localStorage.getItem("accessToken");
    const isAdmin = getIsAdminFromToken(currentToken);

    setIsLogin(true);
    const fullUser = { ...userData, isAdmin: isAdmin };
    setUser(fullUser);

    console.log("AuthProvider - 로그인 성공 (관리자 여부 포함):", fullUser);
  };

  // 로그아웃 처리
  const logout = () => {
    setIsLogin(false);
    setUser(null);
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    console.log("AuthProvider - 로그아웃 완료");
  };

  // 앱 실행 시 로그인 상태 유지 체크
  const checkLogin = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await AxiosAPI.me();
      login(res.data, token); // 서버 유저 정보 + 현재 토큰으로 로그인 처리
    } catch (e) {
      console.log("세션 만료 또는 로그인 필요 상태");
      logout();
    } finally {
      setLoading(false);
    }
  };

  // accessToken 상태 변경 시 스토리지 동기화
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  // Axios 인터셉터 설정 (모든 요청에 토큰 주입 + 401 에러 시 재발급)
  useEffect(() => {
    const requestInterceptor = AxiosAPI.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = AxiosAPI.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // refresh나 login 중 발생하는 401은 무한 루프 방지를 위해 즉시 에러 처리
        if (
          originalRequest.url.includes("/refresh") ||
          originalRequest.url.includes("/login")
        ) {
          return Promise.reject(error);
        }

        // 401 에러(토큰 만료) 발생 시 재발급 시도
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            console.log("토큰 만료 확인 -> 재발급 시도 중...");
            const res = await AxiosAPI.refresh();
            const newToken = res.data;

            setAccessToken(newToken);
            localStorage.setItem("accessToken", newToken);

            // 새 토큰으로 헤더 교체 후 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return AxiosAPI(originalRequest);
          } catch (refreshError) {
            console.error("토큰 재발급 실패 -> 강제 로그아웃");
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      AxiosAPI.interceptors.request.eject(requestInterceptor);
      AxiosAPI.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // 최초 렌더링 시 로그인 체크 실행
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

export const useAuth = () => useContext(AuthContext);
