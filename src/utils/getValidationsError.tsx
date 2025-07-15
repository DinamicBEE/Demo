import { AxiosError } from "axios";

const SERVER_ERROR_MESSAGE = "Error en el servidor";
const TOKEN_NOT_FOUND = "Token no proporcionado";

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
  ERR_NETWORK: "Error de red",
  "Token no proporcionado": "Token no proporcionado",
};

const specificErrors: Record<string, Record<string, string>> = {
  "/": loginErrors,
  "login": loginErrors,
  "home": loginErrors,
};

export const getValidationsError = (
  error: AxiosError,
  path: string
): string  => {

  const errorCode = error.code as string;
  const serverMessage =
    error.response && error.response.data !== null && typeof error.response.data === "object" && "mensaje" in error.response.data
      ? (error.response?.data as { mensaje?: string }).mensaje
      : error.response?.data;
  // Unir errores específicos del path con los errores por defecto
  const messages = { ...defaultErrors, ...(specificErrors[path] || {}) };
  // Si el servidor envió un mensaje específico, lo devolvemos
  if (serverMessage && typeof serverMessage === "string") {
    const firstPartOfMessage = serverMessage.split(",")[0].trim();
    const minutesMatch = serverMessage.match(/\d+/); // Extraer los minutos
    const minutes = minutesMatch ? minutesMatch[0] : "X"; // Si hay minutos, los tomamos, sino usamos "X"

    if (firstPartOfMessage === "The user is locked") {
      return (
        messages[firstPartOfMessage] +
        ". Intenta de nuevo en " +
        minutes +
        " minutos."
      );
    }

    if (firstPartOfMessage !== "") {
      const excludedMessages = [
        "Invalid username or password",
        "The user is locked"
      ];
      if (!excludedMessages.includes(firstPartOfMessage)) {
        return firstPartOfMessage;
      }
    }

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
