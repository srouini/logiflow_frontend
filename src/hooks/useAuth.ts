import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "@/utils/constants";
import { message } from "antd";

interface UseAuth {
  isAuthenticated: boolean | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}

interface AuthResponse {
  profile?: any;
  style?: string;
  crsf?: string;
  font?: string;
  cat?: string;
  userName?: string;
  accessToken?: string;
  refreshToken?: string;
}

const useAuth = (): UseAuth => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Allow null to indicate loading state
  const [loading, setLoading] = useState<boolean>(true); // Start loading as true
  const navigate = useNavigate();

  // useEffect(() => {
  //   checkAuthentication();
  // }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("style");
    const apiEndpoint = `${API_ENDPOINT}/api/auth/refresh-token/`;

    if (!refreshToken) {
      throw new Error("No refresh token available.");
    }

    try {
      const response = await axios.post(apiEndpoint, { refresh_token: refreshToken });
      const newAccessToken = response.data.font;
      if (!newAccessToken) {
        throw new Error("Invalid token response");
      }
      localStorage.setItem("font", newAccessToken);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.clear(); // Clear all tokens on refresh failure
      return false;
    }
  };

  const checkAuthentication = async () => {
    try {
      const isAuthenticated = await refreshToken();
      setIsAuthenticated(isAuthenticated);
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.clear(); // Clear all tokens on check failure
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post<AuthResponse>(
        `${API_ENDPOINT}/api/auth/login/`,
        { username, password }
      );

      if (response.status === 200) {
        const data = response.data;
        
        // Store user data and tokens
        if (data.profile) localStorage.setItem("profile", JSON.stringify(data.profile));
        if (data.style) localStorage.setItem("style", data.style);
        if (data.crsf) localStorage.setItem("crsf", data.crsf);
        if (data.font) localStorage.setItem("font", data.font);
        if (data.cat) localStorage.setItem("cat", data.cat);
        if (data.userName) localStorage.setItem("userName", data.userName);
        if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

        setIsAuthenticated(true);
        navigate("/dashboard");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || "Login failed. Please try again.";
      message.error(errorMessage);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Optional: Call logout endpoint if needed
      // await axios.post(`${API_ENDPOINT}/api/auth/logout/`);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.clear();
      setIsAuthenticated(false);
      setLoading(false);
      navigate("/login");
    }
  };

  return { isAuthenticated, login, logout, loading, setIsAuthenticated };
};

export default useAuth;
