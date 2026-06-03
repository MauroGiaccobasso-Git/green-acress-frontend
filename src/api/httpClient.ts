// URL base utilizada por todas las llamadas
// realizadas hacia el backend.
const API_BASE_URL = "http://localhost:8080";

// Métodos HTTP soportados
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
  token?: string;
};

// Cliente HTTP reutilizable.
//
// Su responsabilidad NO es manejar login
// ni productos.
//
// Su única responsabilidad es centralizar
// la comunicación genérica con backend.
export async function httpClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {

  const {
    method = "GET",
    body,
    token,
  } = options;

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {

      method,

      headers: {

        // Backend espera payload JSON
        "Content-Type": "application/json",

        // JWT agregado únicamente cuando
        // la solicitud requiere autenticación
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },

      // Serializa payload solamente cuando existe
      body: body
        ? JSON.stringify(body)
        : undefined,
    }
  );

  // Convierte respuesta backend a objeto JS
  const data = await response.json();

  // Centraliza errores HTTP para evitar
  // repetir validaciones en todos los módulos
  if (!response.ok) {
    throw new Error(
      data.message ||
      "Error en solicitud"
    );
  }

  // Devuelve respuesta tipada
  return data;
}