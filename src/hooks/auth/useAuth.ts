import { useContext } from "react";

import { AuthContext } from "@/providers/AuthProvider";

// Hook reutilizable encargado de simplificar
// el acceso al contexto global de autenticación.
export function useAuth() {

  const context = useContext(AuthContext);

  // Evita utilizar el hook fuera del provider.
  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return context;
}