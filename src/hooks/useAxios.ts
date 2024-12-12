import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "@/utils/constants";
import useAuth from "../hooks/useAuth"; // Import the useAuth hook correctly
import {jwtDecode} from "jwt-decode"; // Import jwt-decode correctly
import { getCsrfToken } from "@/utils/csrf";

export const useAxios = (): AxiosInstance => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  // Create an axios instance
  const axiosInstance = axios.create({
    baseURL: API_ENDPOINT,
    withCredentials: true,
    headers: {
      "X-CSRFToken": getCsrfToken(),
    },
  });

  return axiosInstance;
};
