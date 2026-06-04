// Claves centralizadas utilizadas para almacenar
// información de autenticación.
//
// Centralizar evita hardcodear strings
// repetidos por toda la aplicación.
const AUTH_USER_KEY = "green_acres_user";
const AUTH_TOKEN_KEY = "green_acres_token";

// Información mínima necesaria para
// reconstruir una sesión autenticada.
//
// Debe mantenerse alineado con la
// respuesta del backend.
export type StoredAuthUser = {
  id: number;
  email: string;
  rol: "ADMIN" | "SOCIO";
  estado: "ACTIVO" | "INACTIVO" | "BLOQUEADO";
};

// Payload mínimo esperado dentro del JWT.
//
// Solo necesitamos exp para validar
// si el token ya se encuentra vencido.
type JwtPayload = {
  exp?: number;
};

// Elimina completamente la sesión persistida.
//
// Se utilizará durante logout y también
// cuando el token almacenado ya no sea válido.
export const clearSession = (): void => {
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Decodifica el payload del JWT sin validar firma.
//
// Esta validación no reemplaza la seguridad
// del backend. Solo permite limpiar sesión local
// si el token ya expiró.
const decodeJwtPayload = (
  token: string
): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    return JSON.parse(
      atob(payload)
    ) as JwtPayload;

  } catch {
    return null;
  }
};

// Verifica si el token ya expiró
// según el campo exp del JWT.
const isTokenExpired = (
  token: string
): boolean => {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  const currentTimeInSeconds =
    Math.floor(Date.now() / 1000);

  return payload.exp <= currentTimeInSeconds;
};

// Recupera token JWT almacenado.
//
// Si el token está vencido o tiene
// formato inválido, se limpia la sesión.
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedToken =
    localStorage.getItem(AUTH_TOKEN_KEY);

  if (!storedToken) {
    return null;
  }

  if (isTokenExpired(storedToken)) {
    clearSession();

    return null;
  }

  return storedToken;
};

// Obtiene usuario persistido previamente.
//
// Antes de devolver el usuario, valida
// que exista un token vigente. Si el token
// expiró, no se restaura la sesión.
export const getStoredUser = (): StoredAuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const validToken = getStoredToken();

  if (!validToken) {
    return null;
  }

  const storedUser =
    localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(
      storedUser
    ) as StoredAuthUser;

  } catch {
    clearSession();

    return null;
  }
};

// Persiste sesión autenticada.
//
// Centralizar esta operación evita
// que distintos componentes manipulen
// localStorage directamente.
export const saveSession = (
  user: StoredAuthUser,
  token: string
): void => {
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify(user)
  );

  localStorage.setItem(
    AUTH_TOKEN_KEY,
    token
  );
};