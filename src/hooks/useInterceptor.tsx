import { useErrorContext } from "@context/ErrorContext";
import api from "../api/index";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getValidationsError } from "../utils/getValidationsError";

export const useInterceptor = () => {
  const { showErrorDialog } = useErrorContext();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (window.location.pathname !== "/") {
          const errorMessage = getValidationsError(
            error,
            window.location.pathname
          );
          showErrorDialog(errorMessage);
        }
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [showErrorDialog]);
};
