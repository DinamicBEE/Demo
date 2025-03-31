import { useState, useEffect } from "react";
import { loadData } from "../../indexedDB/localDB";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        console.log("Intentando obtener el rol desde IndexedDB...");
        const storedRole = await loadData.userData.get("userRole");

        if (storedRole) {
          
          console.log("✅ Rol obtenido desde IndexedDB:", storedRole);
          setRole(storedRole.value);

        } else {
          
          console.warn("⚠️ No se encontró el rol en IndexedDB, asignando ''.");
          setRole("");

        }
      } catch (error) {
        
        console.error("❌ Error al obtener el rol del usuario:", error);
        setRole("");

      } finally {
        setIsLoadingRole(false);
      }
    };

    fetchRole();
  }, []);

  return { role, isLoadingRole };
}