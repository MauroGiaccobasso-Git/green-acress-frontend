import { useState } from "react";
import { useAuth } from "./useAuth";
import { authApi } from "@/api/authApi";

// Hook encargado exclusivamente
// del flujo de autenticación.
export function useLogin() {
  // Obtiene función login desde AuthProvider
  const { login } = useAuth();

  // Estado utilizado para indicar
  // si el login se encuentra ejecutándose.
  const [isLoading, setIsLoading] = useState(false);

  // Estado utilizado para almacenar
  // errores producidos durante login.
  const [error, setError] = useState<string | null>(null);

  // Ejecuta proceso completo login
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);

    setError(null);

    try {
      // Solicita autenticación backend
      const response = await authApi.login(email, password);

      // Guarda sesión autenticada
      login(response.usuario, response.token);

      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al iniciar sesión";

      setError(message);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,

    isLoading,

    error,
  };
}
