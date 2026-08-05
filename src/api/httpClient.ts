import {
  clearSession,
  getStoredToken,
} from "@/features/auth/utils/authStorage";

/*
Error HTTP tipado utilizado por
todo el frontend.

Permite conservar información
relevante enviada por backend:

- mensaje

- código funcional

- estado HTTP

Esto evita depender de textos
para resolver flujos como:

- MFA

- contraseña temporal

- consentimiento pendiente

- sesión expirada
*/
export class HttpError extends Error {
  /*
  Estado HTTP recibido
  desde backend.
  */

  status: number;

  /*
  Código funcional opcional
  enviado por backend.
  */

  code?: string;

  constructor(
    message: string,

    status: number,

    code?: string,
  ) {
    super(message);

    this.name = "HttpError";

    this.status = status;

    this.code = code;
  }
}

/*
URL base utilizada para todas las
comunicaciones realizadas hacia el backend.

En producción utiliza la URL configurada
en la variable NEXT_PUBLIC_API_URL.

En desarrollo local, si no existe esa variable,
utiliza http://localhost:8080.
*/
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") ||
  "http://localhost:8080";

/*
Métodos HTTP soportados
por el cliente reutilizable.

Restringirlos mediante tipos evita:

- errores de escritura

- métodos inválidos

- strings mágicos repetidos
*/
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/*
Configuración opcional utilizada
por httpClient.

Permite personalizar solicitudes
sin repetir configuración.
*/
type RequestOptions = {
  /*
  Método HTTP.

  Si no se envía, utilizamos GET.
  */

  method?: HttpMethod;

  /*
  Información enviada hacia backend.

  Soporta:

  - objetos serializados como JSON

  - FormData para archivos multipart

  httpClient detecta automáticamente
  cuál formato debe utilizar.
  */

  body?: unknown;

  /*
  Permite enviar manualmente
  un token específico.

  Normalmente NO se utiliza.

  Si no existe token manual,
  httpClient recupera automáticamente
  el token persistido.
  */

  token?: string;
};

/*
Convierte de forma segura
la respuesta HTTP a JSON.

No todas las respuestas necesariamente
incluyen contenido JSON válido.

Este helper evita que response.json()
genere un error secundario y oculte
el error HTTP original.
*/
async function parseJsonResponse(response: Response): Promise<unknown> {
  /*
  Respuestas sin contenido
  no deben intentar parsearse.
  */

  if (response.status === 204) {
    return null;
  }

  /*
  Lee primero la respuesta
  como texto.

  Esto permite controlar
  cuerpos vacíos o inválidos.
  */

  const responseText = await response.text();

  /*
  Si no existe contenido,
  devuelve null.
  */

  if (!responseText) {
    return null;
  }

  /*
  Intenta convertir el contenido
  recibido a JSON.
  */

  try {
    return JSON.parse(responseText);
  } catch {
    /*
    Si backend devuelve contenido
    no JSON, se conserva como texto.

    Esto evita perder completamente
    la información recibida.
    */

    return responseText;
  }
}

/*
Determina si una respuesta
puede tratarse como objeto.

Se utiliza para leer de forma segura:

- message

- code
*/
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/*
Determina si el body recibido
corresponde a FormData.

La comprobación protege también
los contextos donde FormData
podría no estar disponible.
*/
function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

/*
Extrae el mensaje de error
recibido desde backend.

Si backend no devuelve uno válido,
utiliza un mensaje genérico.
*/
function getErrorMessage(data: unknown): string {
  if (isRecord(data) && typeof data.message === "string") {
    return data.message;
  }

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return "Error en solicitud";
}

/*
Extrae el código funcional
recibido desde backend.

Si no existe o no es válido,
devuelve undefined.
*/
function getErrorCode(data: unknown): string | undefined {
  if (isRecord(data) && typeof data.code === "string") {
    return data.code;
  }

  return undefined;
}

/*
Construye los headers comunes
para cada solicitud.

Cuando el body es FormData NO se define
Content-Type manualmente.

El navegador debe generar automáticamente:

multipart/form-data

junto con su boundary correspondiente.
*/
function buildRequestHeaders({
  authToken,
  usesFormData,
  hasBody,
}: {
  authToken: string | null;
  usesFormData: boolean;
  hasBody: boolean;
}): HeadersInit {
  return {
    ...(hasBody && !usesFormData
      ? {
          "Content-Type": "application/json",
        }
      : {}),

    ...(authToken
      ? {
          Authorization: `Bearer ${authToken}`,
        }
      : {}),
  };
}

/*
Prepara el body antes de enviarlo.

- FormData se entrega directamente al navegador.

- Los demás valores se serializan como JSON.

- Si no existe body, devuelve undefined.
*/
function buildRequestBody(body: unknown): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (isFormData(body)) {
    return body;
  }

  return JSON.stringify(body);
}

/*
Cliente HTTP reutilizable.

Responsabilidades:

- comunicarse con backend

- incorporar JWT automáticamente

- agregar headers comunes

- soportar JSON y FormData

- manejar errores compartidos

- centralizar fetch

Toda API del frontend debería
utilizar este cliente.

Los containers NO deberían utilizarlo.

Los hooks NO deberían utilizarlo.

La arquitectura esperada es:

Hook

↓

API Layer

↓

httpClient

↓

Backend
*/
export async function httpClient<T>(
  endpoint: string,

  options: RequestOptions = {},
): Promise<T> {
  /*
  Extrae configuración recibida.

  Si method no existe:

  GET por defecto.
  */

  const {
    method = "GET",

    body,

    token,
  } = options;

  /*
  Determina qué token utilizar.

  Prioridad:

  token manual

  ↓

  token persistido

  Esto permite flexibilidad
  sin romper automatización.
  */

  const authToken = token || getStoredToken();

  /*
  Detecta el formato de envío.

  Esta información permite evitar
  un Content-Type incorrecto cuando
  se adjuntan archivos.
  */

  const usesFormData = isFormData(body);

  /*
  Ejecuta solicitud HTTP real.

  Construye:

  URL

  +

  método

  +

  headers

  +

  body
  */

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,

    {
      method,

      headers: buildRequestHeaders({
        authToken,
        usesFormData,
        hasBody: body !== undefined,
      }),

      body: buildRequestBody(body),
    },
  );

  /*
  Convierte la respuesta
  a un valor usable.

  El parseo es seguro incluso si:

  - la respuesta está vacía

  - backend no devuelve JSON válido

  - el endpoint responde 204
  */

  const data = await parseJsonResponse(response);

  /*
  Manejo centralizado
  de sesión expirada.

  Sólo se limpia la sesión cuando:

  - backend devuelve 401

  - la solicitud utilizó un token

  Esto evita romper endpoints públicos
  de autenticación como:

  - login

  - recuperación de contraseña

  - verificación MFA

  En esos casos un 401 representa
  un error funcional del flujo,
  no necesariamente una sesión vencida.
  */

  if (response.status === 401 && authToken) {
    clearSession();

    /*
    Redirección únicamente
    en navegador.
    */

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }

    throw new HttpError(
      getErrorMessage(data) || "Sesión expirada o no autorizada",

      response.status,

      getErrorCode(data),
    );
  }

  /*
  Manejo común de errores backend.

  Si backend respondió error:

  - conserva message

  - conserva code

  - conserva status HTTP

  Esto permite que hooks y containers
  resuelvan flujos funcionales
  sin comparar textos.
  */

  if (!response.ok) {
    throw new HttpError(
      getErrorMessage(data),

      response.status,

      getErrorCode(data),
    );
  }

  /*
  Devuelve respuesta tipada.

  <T> permite reutilizar
  el mismo httpClient
  para cualquier entidad.

  Productos

  Usuarios

  Reservas

  etc
  */

  return data as T;
}