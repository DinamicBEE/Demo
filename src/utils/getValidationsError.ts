import { useErrorContext } from "@context/ErrorContext";
import { AxiosError } from "axios";

const SERVER_ERROR_MESSAGE = "Error en el servidor";

export const loginErrors: Record<string, string> = {
  "Invalid username or password": "Usuario o contraseña incorrectos",
  "The user is locked": "El usuario está bloqueado",
};

export const defaultErrors: Record<string, string> = {
  ERR_BAD_REQUEST: "Solicitud incorrecta",
  ERR_UNAUTHORIZED: "No autorizado",
  ERR_FORBIDDEN: "No tiene acceso a este recurso",
  ERR_NOT_FOUND: "Recurso no encontrado",
  ERR_INTERNAL_SERVER_ERROR: SERVER_ERROR_MESSAGE,
  ERR_GATEWAY_TIMEOUT: SERVER_ERROR_MESSAGE,
  ERR_SERVICE_UNAVAILABLE: SERVER_ERROR_MESSAGE,
  ERR_BAD_GATEWAY: SERVER_ERROR_MESSAGE,
};

const specificErrors: Record<string, Record<string, string>> = {
  "/": loginErrors,
};

export const getValidationsError = (
  error: AxiosError,
  path: string
): string => {
  const errorCode = error.code as string;
  const serverMessage = error.response?.data;
  // Unir errores específicos del path con los errores por defecto
  const messages = { ...defaultErrors, ...(specificErrors[path] || {}) };
  // Si el servidor envió un mensaje específico, lo devolvemos
  if (serverMessage && typeof serverMessage === "string") {
    const firstPartOfMessage = serverMessage.split(",")[0].trim();
    if (messages[firstPartOfMessage]) {
      return messages[firstPartOfMessage];
    }
  }

  // Buscar primero por código de error
  if (errorCode && messages[errorCode]) {
    return messages[errorCode];
  }

  // Si no se encuentra un mensaje específico, devolver un mensaje genérico
  return "Ha ocurrido un error inesperado";
};
