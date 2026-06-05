import {
  clearSession,
  getStoredToken,
} from "@/features/auth/utils/authStorage";

/*
URL base utilizada para todas las
comunicaciones realizadas hacia backend.

Centralizar esta URL evita:

- repetir localhost múltiples veces

- errores de escritura

- cambios masivos futuros

Si mañana backend cambia de puerto
o se despliega, se modifica acá.
*/
const API_BASE_URL =
  "http://localhost:8080";

/*
Métodos HTTP soportados
por el cliente reutilizable.

Restringirlos mediante tipos evita:

- errores de escritura

- métodos inválidos

- strings mágicos repetidos
*/
type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

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

  Se serializará automáticamente
  como JSON.
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
Cliente HTTP reutilizable.

Responsabilidades:

- comunicarse con backend

- incorporar JWT automáticamente

- agregar headers comunes

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

  options: RequestOptions = {}

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

  const authToken =

    token ||

    getStoredToken();

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

  const response =
    await fetch(

      `${API_BASE_URL}${endpoint}`,

      {

        method,

        headers: {

          /*
          Todas las solicitudes
          utilizan JSON.
          */

          "Content-Type":
            "application/json",

          /*
          Agrega Authorization
          únicamente cuando existe token.

          Resultado:

          Authorization:

          Bearer xxxxxxxxx
          */

          ...(authToken

            ? {

                Authorization:
                  `Bearer ${authToken}`,

              }

            : {}),

        },

        /*
        Convierte body a JSON.

        Si no existe body,
        se envía undefined.
        */

        body:

          body

            ? JSON.stringify(body)

            : undefined,

      }

    );

  /*
  Manejo centralizado
  de sesión expirada.

  Si backend devuelve 401:

  - limpiar sesión

  - redirigir login

  - detener flujo
  */

  if (

    response.status === 401

  ) {

    clearSession();

    /*
    Redirección únicamente
    en navegador.
    */

    if (

      typeof window !== "undefined"

    ) {

      window.location.href = "/";

    }

    throw new Error(
      "Sesión expirada o no autorizada"
    );

  }

  /*
  Convierte respuesta
  JSON a objeto usable.
  */

  const data =
    await response.json();

  /*
  Manejo común de errores backend.

  Si backend respondió error:

  usar mensaje backend

  o mensaje genérico.
  */

  if (

    !response.ok

  ) {

    throw new Error(

      data.message ||

      "Error en solicitud"

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

  return data;

}