import { createContext, useContext, useState, useMemo, ReactNode } from "react";

interface RoleContextType {
  role: 1 | 2; // Los roles disponibles
  switchRole: () => void; // Función para cambiar el rol
}

const ApprovalsRolUserContext = createContext<RoleContextType | null>(null);

export const useApprovalsRolUser = () => {
  const context = useContext(ApprovalsRolUserContext);
 
  if (!context) throw new Error("useRole debe usarse dentro de un RoleProvider");

  return context;
};

// Provider que manejará el estado del rol
export const ApprovalsRolUserProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<1 | 2>(2); // Valor inicial

  // Función para cambiar entre roles
  const switchRole = () => {
    setRole((prevRole) => (prevRole === 2  ? 1 : 2));
  };

  // Memoizamos el valor para evitar renders innecesarios
  const value = useMemo(() => ({ role, switchRole }), [role]);

  return <ApprovalsRolUserContext.Provider value={value}>{children}</ApprovalsRolUserContext.Provider>;
};