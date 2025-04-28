import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { AuthContextType, Tokens, IUser } from "@models/auth.model";
import { getUserRol, loginUser } from "@services/authService";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
  user: IUser | null;
  isLoading: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    error: null,
    user: null,
    isLoading: true,
  });

  const setTokens = useCallback(({ accessToken, refreshToken }: Tokens) => {
    Cookies.set("accessToken", accessToken, {
      expires: 2 / 24, // 2 hours
      sameSite: "Strict",
      secure: true,
    });
    Cookies.set("refreshToken", refreshToken, {
      expires: 7, // 7 days
      sameSite: "Strict",
      secure: true,
    });
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      error: null,
    }));
  }, []);

  const setUserWithRole = useCallback(async (username: string) => {
    try {
      const { userRole } = await getUserRol();
      setState((prev) => ({
        ...prev,
        user: { first_name: username, role: userRole },
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Error al obtener el rol del usuario",
      }));
    }
  }, []);

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const tokens = await loginUser(username, password);
        Cookies.set("username", username);
        setTokens(tokens);
        await setUserWithRole(username);
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          isAuthenticated: false,
          error: err.message || "Login failed",
          user: null,
        }));
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const logOut = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      error: null,
      user: null,
    }));
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("username");
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");
      const username = Cookies.get("username");

      if (!username) {
        logOut();
        return;
      }

      if (accessToken || refreshToken) {
        await setUserWithRole(username);
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          error: null,
        }));
      }
      setState((prev) => ({ ...prev, isLoading: false }));
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        error: state.error,
        user: state.user,
        isLoading: state.isLoading,
        handleLogin,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
