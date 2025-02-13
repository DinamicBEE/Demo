import { useErrorContext } from '@context/ErrorContext';
import axios from 'axios';
import { useEffect } from 'react';

export const useInterceptor  = () => {
    const { showErrorDialog } = useErrorContext();

    useEffect(() => {

      const interceptor = axios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          let errorMessage =
            "Ha ocurrido un error inesperado. Por favor, contacte a soporte técnico.";

          if (error.response) {
            switch (error.response.status) {
              case 400:
                errorMessage =
                  "Solicitud incorrecta. Por favor, verifique los datos enviados.";
                break;
              case 401:
                errorMessage =
                  "No autorizado. Por favor, inicie sesión nuevamente.";
                break;
              case 403:
                errorMessage = "No tiene acceso a este recurso.";
                break;
              case 404:
                errorMessage = "Recurso no encontrado.";
                break;
              case 500:
                errorMessage =
                  "Error en el servidor. Por favor, contacte a soporte técnico.";
                break;
              case 502:
                errorMessage =
                  "Error en el servidor. Por favor, contacte a soporte técnico.";
                break;
              case 503:
                errorMessage =
                  "Error en el servidor. Por favor, contacte a soporte técnico.";
                break;
              case 504:
                errorMessage =
                  "Error en el servidor. Por favor, contacte a soporte técnico.";
                break;
              default:
                errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
                break;
            }
          } else if (error.request) {
            errorMessage =
              "No se recibió respuesta del servidor. Por favor, verifique su conexión a internet.";
          } else {
            errorMessage = error.message;
          }
          console.log(errorMessage);
          showErrorDialog(errorMessage);

          return Promise.reject(error);
        }
      );


      return () => {
        axios.interceptors.response.eject(interceptor);
      };

    }, [showErrorDialog]);
}