import {
  clearSession,
  getStoredToken,
} from "@/features/auth/utils/authStorage";

// URL base utilizada por todas las llamadas
// realizadas hacia el backend.
const API_BASE_URL = "http://localhost:8080";

// Métodos HTTP soportados.
type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

// Configuración opcional que podrá recibir
// cada llamada realizada mediante httpClient.
type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;

  // Permite enviar un token manualmente si fuera necesario.
  // Si no se envía, httpClient utilizará el token persistido.
  token?: string;
};

// Cliente HTTP reutilizable.
//
// Centraliza comunicación con backend,
// incorporación de JWT y manejo común
// de errores HTTP.
export async function httpClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    token,
  } = options;

  // Prioriza token recibido explícitamente.
  // Si no existe, utiliza el token persistido.
  const authToken =
    token || getStoredToken();

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method,

      headers: {
        "Content-Type": "application/json",

        ...(authToken
          ? {
              Authorization: `Bearer ${authToken}`,
            }
          : {}),
      },

      body: body
        ? JSON.stringify(body)
        : undefined,
    }
  );

  if (response.status === 401) {
    clearSession();

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }

    throw new Error("Sesión expirada o no autorizada");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Error en solicitud"
    );
  }

  return data;
}