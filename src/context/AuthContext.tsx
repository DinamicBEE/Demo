import { createContext, useState, useContext, useEffect, useCallback, ReactNode, useMemo } from "react";
import Cookies from "js-cookie";
import { AuthContextType, Tokens, AuthState } from "@models/auth.model";
import { getUserRol, loginUser, refreshAuthToken } from "@services/authService";
import { loadData } from "../indexedDB/localDB";
import { COOKIE_NAMES } from "@models/common.const";
import { getRoleName } from "@utils/getRoles";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

const initialState: AuthState = {
  isAuthenticated: false,
  error: null,
  user: null,
  isLoading: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const setAuthState = useCallback((updates: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setTokens = useCallback(({ accessToken, refreshToken }: Tokens) => {
    Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      expires: 2 / 24,
      sameSite: "Strict",
      secure: true,
    });
    Cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      expires: 7,
      sameSite: "Strict",
      secure: true,
    });
    setAuthState({ isAuthenticated: true, error: null });
  }, []);

  const setUserWithRole = useCallback(async (username: string) => {
    try {
      const { userRole } = await getUserRol();
      const user = { first_name: username, role: getRoleName(userRole.toLowerCase()) };
      
      setAuthState({ user });
      try {
        await loadData.userData.put({ key: "userRole", value: getRoleName(userRole.toLowerCase()) });
      } catch (dbError) {
        console.error("Error al guardar en IndexedDB:", dbError);
      }
    } catch (error) {
      setAuthState({ error: "Error al obtener el rol del usuario" });
    }
  }, []);

  const handleLogin = useCallback(async (username: string, password: string) => {
      setAuthState({ error: null });
      try {
        const tokens = await loginUser(username, password);
        Cookies.set(COOKIE_NAMES.USERNAME, username);
        setTokens(tokens);
        await setUserWithRole(username);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error 
        ? err.message 
        : "Error durante el inicio de sesión";

         setAuthState({ isAuthenticated: false, error: errorMessage, user: null });
      } finally {
        setAuthState({ isLoading: false });
      }
    },
    []
  );

  const logOut = useCallback(async () => {
    setState({...initialState, isLoading: false});

    Object.values(COOKIE_NAMES).forEach(cookieName => {
      Cookies.remove(cookieName);
    });
    try {
      await loadData.userData.delete("userRole");
    } catch (error) {
      console.error("Error al limpiar IndexedDB:", error);
    }
  }, []);

  const checkAndRefreshToken = useCallback(async () => {
    const refreshToken = Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
    const accessToken = Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);
    
    if (!refreshToken) {
      logOut();
      return;
    }
    
    if (!accessToken && refreshToken) {
      try {
        const newTokens = await refreshAuthToken(refreshToken);
        setTokens(newTokens);
      } catch (error) {
        console.error("Error al refrescar token:", error);
        logOut();
      }
    }
  }, [logOut, setTokens]);

  useEffect(() => {
    const initializeAuth = async () => {
      setAuthState({ isLoading: true });

      const username = Cookies.get(COOKIE_NAMES.USERNAME);

      if (!username) {
        logOut();
        return;
      }

      //await checkAndRefreshToken();

      const accessToken = Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);
      const refreshToken = Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);

      if (accessToken || refreshToken) {
        try {
          await setUserWithRole(username);
          setAuthState({ 
            isAuthenticated: true, 
            error: null 
          });
        } catch (error) {
          console.error("Error al inicializar autenticación:", error);
          logOut();
        }
      }
      setState((prev) => ({ ...prev, isLoading: false }));
    };

    initializeAuth();
  }, []);

const contextValue = useMemo(() => ({
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    user: state.user,
    isLoading: state.isLoading,
    handleLogin,
    logOut,
  }), [
    state.isAuthenticated, 
    state.error, 
    state.user, 
    state.isLoading, 
    handleLogin, 
    logOut
  ]);

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}