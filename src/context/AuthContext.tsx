import { createContext, useState, useContext, useEffect, useCallback, ReactNode, useMemo, } from "react";
import Cookies from "js-cookie";
import { AuthContextType, Tokens } from "@models/auth.model";
import { getUserRol, loginUser } from "@services/authService";
import { MODE } from "@services/settings";
import { getUserInfo } from "@services/userService";
import { loadData } from "../indexedDB/localDB";

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

        const { accessToken, refreshToken, token } = await loginUser(username, password);
        const userToken = MODE === "LOCAL" ? token : accessToken;

        if (userToken) {

          //Esta linea solo trae los dato de prueba.
          const { data } = await getUserInfo(userToken);

          if (data) {

            setTokens({ accessToken, refreshToken, token });
            setUser(data);

            const result: any = await getUserRol();

            await loadData.userData.put({ key: 'userRole', value: result.userRole });

            // Actualizar el estado del usuario con el rol obtenido
            setUser((prevUser: any) => ({ ...prevUser, role: result.userRole }));
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

  const logOut = useCallback(async () => {
    setIsAuthenticated(false);
    setToken(null);
    setError(null);
    setUser(null); // Reiniciar el estado del usuario

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove('username');

    // Eliminar solo el registro del rol del usuario
    await loadData.userData.delete("userRole");
    console.log("Rol eliminado de IndexedDB");
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

            // Obtener el rol desde IndexedDB
            const userRecord = await loadData.userData.get("userRole");
            const role = userRecord ? userRecord.value : null;

            // Actualizar el estado del usuario con el rol obtenido
            setUser((prevUser: any) => ({ ...prevUser, role }));

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
      user
    }),
    [isAuthenticated, handleLogin, logOut, token, error, isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
