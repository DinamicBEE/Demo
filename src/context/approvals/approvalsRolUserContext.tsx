import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { loadData } from "../../indexedDB/localDB";
import { useApi } from "@hooks/useApi";


interface RoleContextType {
  role: string | null; // Los roles disponibles
}

const ApprovalsRolUserContext = createContext<RoleContextType | null>(null);

export const useApprovalsRolUser = () => {
  const context = useContext(ApprovalsRolUserContext);

  if (!context) throw new Error("useRole debe usarse dentro de un RoleProvider");

  return context;
};

// Provider que manejará el estado del rol
export const ApprovalsRolUserProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string | null>(null); // Valor inicial

  const { data, error, isLoading, refetch } = useApi(() => {
    return loadData.userData.get('userRole');
  }, {
    onSuccess: (result) => {
      if (result?.value) setRole(result.value);
    },
    onError: (err) => {
      console.error('Error fetching user role:', err);
    },
    autoFetch: true
  });

  // Memoizamos el valor para evitar renders innecesarios
  const value = useMemo(() => ({ role }), [role]);

  return <ApprovalsRolUserContext.Provider value={value}>{children}</ApprovalsRolUserContext.Provider>;
};