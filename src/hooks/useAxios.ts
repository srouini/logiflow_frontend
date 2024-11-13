import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "@/utils/constants";
import useAuth from "../hooks/useAuth"; // Import the useAuth hook correctly
import {jwtDecode} from "jwt-decode"; // Import jwt-decode correctly

export const useAxios = (): AxiosInstance => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  // Create an axios instance
  const axiosInstance = axios.create({
    baseURL: API_ENDPOINT,
  });

  // Function to refresh the token
  const refreshToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem("style");

    if (!refreshToken) return false;

    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/refresh-token/`, {
        refresh_token: refreshToken,
      });

      const newAccessToken = response.data.font; // Make sure to retrieve the correct token key
      localStorage.setItem("font", newAccessToken);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  // Function to check token validity
  const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  // Add request interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      const accessToken = localStorage.getItem("font");

      if (accessToken) {
        if (isTokenValid(accessToken)) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        } else {
          const refreshSuccess = await refreshToken();

          if (refreshSuccess) {
            const newToken = localStorage.getItem("font");
            if (newToken) {
              config.headers["Authorization"] = `Bearer ${newToken}`;
            }
          } else {
            setIsAuthenticated(false);
            localStorage.clear();
            navigate("/login");
            return Promise.reject(new AxiosError("Session expired, please login again."));
          }
        }
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        const refreshSuccess = await refreshToken();

        if (refreshSuccess) {
          const originalRequest = error.config;
          const newAccessToken = localStorage.getItem("font");
          if (newAccessToken && originalRequest) {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          }
        } else {
          setIsAuthenticated(false);
          localStorage.clear();
          navigate("/login");
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
