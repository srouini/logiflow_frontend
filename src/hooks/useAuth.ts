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
  setIsAuthenticated:any;
}

const useAuth = (): UseAuth => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Allow null to indicate loading state
  const [loading, setLoading] = useState<boolean>(true); // Start loading as true
  const navigate = useNavigate();


  useEffect(() => {
    checkAuthentication();
  }, []);


  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("style");

    if (!refreshToken) {
      throw new Error("No refresh token available.");
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/refresh-token/', { refresh_token: refreshToken });
      const newAccessToken = response.data.font;
      localStorage.setItem("font", newAccessToken); // Store the new access token
      return true; // User is authenticated
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false; // User is not authenticated
    }
  };

  const checkAuthentication = async () => {
    try {
      const isAuthenticated = await refreshToken();
      setIsAuthenticated(isAuthenticated);
    } catch (error) {
      setIsAuthenticated(false); // Set to false if error occurs
    } finally {
      setLoading(false); // Set loading to false after check completes
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/api/auth/login/`,
        { username, password }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        if (response?.data?.profile) {
          localStorage.setItem("profile", JSON.stringify(response?.data?.profile));
        }       
        if (response?.data?.style) {
          localStorage.setItem("style", response?.data?.style);
        }
        localStorage.setItem("crsf", response?.data?.crsf);
        if (response?.data?.font) {
          localStorage.setItem("font", response?.data?.font);
        }
        if (response?.data?.cat) {
          localStorage.setItem("cat", response?.data?.cat);
        }
        if (response?.data?.userName) {
          localStorage.setItem("userName", response?.data?.userName);
        }
        localStorage.setItem("accessToken", response?.data?.accessToken);
        localStorage.setItem("refreshToken", response?.data?.refreshToken);
        navigate("/dashboard"); // Redirect to dashboard after login
      }
    } catch (error: any) {
      message.error(error?.response?.data?.detail);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {

    try {
      setLoading(true);
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/login")
      // await axiosInstance.post("/api/auth/logout/", {}, { withCredentials: true });

      // setIsAuthenticated(false);
      // navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return { isAuthenticated, login, logout, loading,setIsAuthenticated };
};

export default useAuth;
