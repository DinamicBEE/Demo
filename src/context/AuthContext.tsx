import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import Cookies from "js-cookie";
import { AuthContextType, Tokens } from "@models/auth.model";
import { loginUser } from "@services/authService";
import { MODE } from "@services/settings";
import { getUserInfo } from "@services/userService";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const setTokens = (tokens: Tokens) => {
    const userToken = MODE === "LOCAL" ? tokens.token : tokens.accessToken;
    Cookies.set("accessToken", userToken, {
      expires: 1 / 96, // 15 minutos
      sameSite: "Strict",
      secure: true,
    });

    if (MODE === "BACK") {
      Cookies.set("refreshToken", tokens.refreshToken, {
        expires: 7, // 7 días
        sameSite: "Strict",
        secure: true,
      });
    }
    setToken(tokens.accessToken);
    setError(null);
    setIsAuthenticated(true);
  };

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      setError(null);
      try {
        const { accessToken, refreshToken, token } = await loginUser(
          username,
          password
        );
        const userToken = MODE === "LOCAL" ? token : accessToken;
        if (userToken) {
          const { data } = await getUserInfo(userToken);
          if (data) {
            setTokens({ accessToken, refreshToken, token });
            setUser({ ...data, role: 1 });
          }
        }
      } catch (err: any) {
        setError(err.message);
        setIsAuthenticated(false);
        setToken(null);
      }
    },
    []
  );

  const logOut = useCallback(() => {
    setIsAuthenticated(false);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setToken(null);
    setError(null);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
          setToken(accessToken);
          const { data } = await getUserInfo(accessToken);
          if (data) {
            setUser({ ...data, role: 1 });
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
        }
        setError(null);
      } catch {
        setError("Error al inicializar autenticación");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      handleLogin,
      logOut,
      token,
      error,
      isLoading,
      user,
    }),
    [isAuthenticated, handleLogin, logOut, token, error, isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
