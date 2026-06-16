/*
Claves utilizadas para guardar
información de autenticación
en localStorage.

Se centralizan en constantes para evitar:

- repetir strings

- equivocarse al escribir claves

- tener claves distintas en distintas partes
  de la aplicación

Si algún día se cambia el nombre de una clave,
se modifica en un solo lugar.
*/
const AUTH_USER_KEY =
  "green_acres_user";

const AUTH_TOKEN_KEY =
  "green_acres_token";

/*
Representa la información mínima
del usuario autenticado que necesitamos
guardar en frontend.

No guardamos datos innecesarios.

Solamente guardamos lo necesario para:

- reconstruir sesión

- conocer rol

- proteger rutas

- mostrar información básica

Este tipo debe mantenerse alineado
con la respuesta enviada por backend
durante el login.
*/
export type StoredAuthUser = {
  id: number;

  email: string;

  rol:
    | "ADMIN"
    | "SOCIO";

  estado:
    | "ACTIVO"
    | "INACTIVO"
    | "BLOQUEADO";
};

/*
Representa la parte mínima del JWT
que necesitamos leer desde frontend.

En este caso sólo nos interesa exp,
que indica cuándo vence el token.

Importante:

El frontend NO valida seguridad real
del token.

La validación real siempre corresponde
al backend.

Acá sólo usamos exp para limpiar
la sesión local si el token ya venció.
*/
type JwtPayload = {
  exp?: number;
};

/*
Elimina completamente la sesión
guardada en localStorage.

Se utiliza cuando:

- el usuario cierra sesión

- el token expiró

- el token tiene formato inválido

- backend responde 401 y se debe
  limpiar sesión local
*/
export const clearSession = (): void => {
  localStorage.removeItem(AUTH_USER_KEY);

  localStorage.removeItem(AUTH_TOKEN_KEY);
};

/*
Decodifica el payload del JWT.

Un JWT normalmente tiene 3 partes:

header.payload.signature

Separadas por puntos.

Acá sólo leemos la segunda parte,
que corresponde al payload.

Importante:

Esto NO valida la firma del token.

Sólo sirve para leer información
localmente, como la fecha de expiración.
*/
const decodeJwtPayload = (
  token: string
): JwtPayload | null => {

  try {

    /*
    Obtenemos la segunda parte
    del token JWT.
    */
    const payload =
      token.split(".")[1];

    /*
    Si no existe payload,
    el token no tiene formato válido.
    */
    if (!payload) {

      return null;

    }

    /*
    atob decodifica base64.

    JSON.parse convierte el texto
    decodificado en objeto JavaScript.
    */
    return JSON.parse(
      atob(payload)
    ) as JwtPayload;

  } catch {

    /*
    Si ocurre cualquier error,
    consideramos que el token
    no puede ser interpretado.
    */
    return null;

  }

};

/*
Verifica si el token se encuentra
vencido según su campo exp.

Si el token:

- no puede decodificarse

- no tiene exp

- exp ya pasó

entonces se considera inválido.
*/
const isTokenExpired = (
  token: string
): boolean => {

  /*
  Decodificamos el payload
  para leer la expiración.
  */
  const payload =
    decodeJwtPayload(token);

  /*
  Si no existe exp, no confiamos
  en el token y lo consideramos
  vencido.
  */
  if (!payload?.exp) {

    return true;

  }

  /*
  Date.now() devuelve milisegundos.

  El campo exp del JWT viene
  normalmente en segundos.

  Por eso dividimos entre 1000.
  */
  const currentTimeInSeconds =
    Math.floor(Date.now() / 1000);

  /*
  Si exp es menor o igual al tiempo
  actual, el token ya venció.
  */
  return payload.exp <= currentTimeInSeconds;

};

/*
Recupera el token JWT guardado
en localStorage.

Antes de devolverlo valida:

- que estemos en navegador

- que exista token

- que el token no esté vencido

Si el token está vencido,
se limpia toda la sesión.
*/
export const getStoredToken =
  (): string | null => {

    /*
    Evita acceder a localStorage
    fuera del navegador.

    En Next.js puede existir render
    del lado servidor, donde window
    no existe.
    */
    if (typeof window === "undefined") {

      return null;

    }

    /*
    Leemos token persistido.
    */
    const storedToken =
      localStorage.getItem(AUTH_TOKEN_KEY);

    /*
    Si no hay token guardado,
    no hay sesión restaurable.
    */
    if (!storedToken) {

      return null;

    }

    /*
    Si el token está vencido
    o tiene formato inválido,
    limpiamos sesión y no lo devolvemos.
    */
    if (isTokenExpired(storedToken)) {

      clearSession();

      return null;

    }

    /*
    Token existente y vigente.
    */
    return storedToken;

  };

/*
Obtiene el usuario guardado
en localStorage.

Antes de devolverlo valida
que exista un token vigente.

Esto evita restaurar un usuario
si la sesión real ya expiró.
*/
export const getStoredUser =
  (): StoredAuthUser | null => {

    /*
    Evita acceder a localStorage
    fuera del navegador.
    */
    if (typeof window === "undefined") {

      return null;

    }

    /*
    Validamos primero token.

    Si no hay token válido,
    no tiene sentido devolver usuario.
    */
    const validToken =
      getStoredToken();

    if (!validToken) {

      return null;

    }

    /*
    Recuperamos usuario guardado.
    */
    const storedUser =
      localStorage.getItem(AUTH_USER_KEY);

    /*
    Si no existe usuario guardado,
    no hay sesión completa.
    */
    if (!storedUser) {

      return null;

    }

    try {

      /*
      Convertimos JSON guardado
      en objeto usable por frontend.
      */
      return JSON.parse(
        storedUser
      ) as StoredAuthUser;

    } catch {

      /*
      Si el JSON está corrupto
      o no puede parsearse,
      limpiamos sesión completa.
      */
      clearSession();

      return null;

    }

  };

/*
Guarda la sesión autenticada
en localStorage.

Se ejecuta normalmente luego
de un login exitoso.

Centralizar esta operación evita
que containers, hooks o componentes
manipulen localStorage directamente.
*/
export const saveSession = (
  user: StoredAuthUser,
  token: string
): void => {

  /*
  Guardamos usuario como JSON,
  porque localStorage sólo guarda texto.
  */
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify(user)
  );

  /*
  Guardamos token JWT.
  */
  localStorage.setItem(
    AUTH_TOKEN_KEY,
    token
  );

};