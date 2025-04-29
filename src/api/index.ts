import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { API_AUTH, MODE } from "../services/settings";
import { refreshAuthToken } from "@services/authService";
import { getValidationsError } from "../utils/getValidationsError";
import { toast } from "../utils/index";

const setNewTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set("accessToken", accessToken, {
    expires: 2 / 24, // 2 horas
    sameSite: "Strict",
    secure: true,
  });

  Cookies.set("refreshToken", refreshToken, {
    expires: 7, // 7 días
    sameSite: "Strict",
    secure: true,
  });
};

const removeTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

// Configuración base del cliente Axios
const api = axios.create({
  baseURL: API_AUTH,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de solicitud para agregar el token al encabezado
api.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// Interceptor de respuesta para manejar errores y renovación de token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      window.location.pathname !== "/" &&
      MODE === "BACK"
    ) {
      originalRequest._retry = true;

      // If a refresh is already in progress, wait for it to complete
      if (isRefreshing) {
        try {
          await refreshPromise;
          // After token refresh completes, update this request's Authorization header
          const token = Cookies.get("accessToken");
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // Start a new token refresh process
      isRefreshing = true;
      refreshPromise = new Promise(async (resolve, reject) => {
        try {
          const refreshToken = Cookies.get("refreshToken");
          if (!refreshToken) {
            throw new Error("No se encontró el token");
          }

          const { accessToken, refreshToken: newRefreshToken } =
            await refreshAuthToken(refreshToken);

          if (accessToken && newRefreshToken) {
            // Guardar los nuevos tokens en las cookies
            setNewTokens(accessToken, newRefreshToken);

            // Establecer el nuevo encabezado Authorization
            api.defaults.headers.common["Authorization"] =
              `Bearer ${accessToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

            resolve(true);
          } else {
            throw new Error("Error al renovar el token");
          }
        } catch (err: any) {
          toast(err.message, "error");
          removeTokens();
          reject(err);
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      });

      try {
        await refreshPromise;
        // Reintentar la solicitud original con el nuevo token
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    if (window.location.pathname !== "/home") {
      const errorResponse = getValidationsError(
        error,
        window.location.pathname
      );

      toast(errorResponse, "error");
    }
    return Promise.reject(error);
  }
);

export default api;
