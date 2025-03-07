// UserContext.tsx
import { ReactNode, createContext, useState, useContext, useEffect, useCallback } from "react";
import { getUserInfo } from "../services/userService";
import { UserContextType } from "@models/common.model";

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUser = () => useContext(UserContext);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContextType["user"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (currentToken: string) => {
    if (!currentToken) return null;
    try {
      const { data } = await getUserInfo(currentToken);
      setUser({ ...data, role: 1 });
      return data;
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
      setUser(null);
      throw error;
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};