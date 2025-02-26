// AuthContext.tsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { AuthContextType, Tokens } from "@models/auth.model";
import { loginUser, refreshAuthToken } from "@services/authService";
import { useNavigate } from "react-router-dom";
import { useUser } from "@context/UserContext";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchUser, setLoading } = useUser();
  const navigate = useNavigate();

  const setTokens = (tokens: Tokens) => {
    setIsAuthenticated(true);
    Cookies.set("accessToken", tokens.accessToken, {
      expires: 1 / 96, // 15 minutos
      sameSite: "Strict",
      secure: true,
    });
    Cookies.set("refreshToken", tokens.refreshToken, {
      expires: 7, // 7 días
      sameSite: "Strict",
      secure: true,
    });
    setToken(tokens.accessToken);
    setError(null);
  };

  const handleLogin = useCallback(async (user: string, password: string) => {
    setError(null);
    try {
      const { accessToken, refreshToken } = await loginUser(user, password);
      if (accessToken && refreshToken) {
        const userData = await fetchUser(accessToken);
        if (userData) {
          setTokens({ accessToken, refreshToken });
          navigate("/home");
        }
      }
    } catch (err: any) {
      setIsAuthenticated(false);
      setToken(null);
      setError(err.message);
    }
  }, []);

  const logOut = useCallback(() => {
    try {
      setIsAuthenticated(false);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setToken(null);
      setError(null);
    } catch (err) {
      setError("Error al cerrar sesión");
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        if (accessToken && refreshToken) {
          setToken(accessToken);
          setIsAuthenticated(true);
          await fetchUser(accessToken);
        } else {
          setToken(null);
          setIsAuthenticated(false);
        }
        setError(null);
      } catch (err) {
        setError("Error al inicializar autenticación");
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        isLoading,
        error,
        handleLogin,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
