/*
==================================================
CLAVE DE ALMACENAMIENTO
==================================================
*/

/*
Clave utilizada para guardar temporalmente
el desafío MFA dentro de sessionStorage.

Se mantiene centralizada para evitar:

- repetir strings
- errores al escribir la clave
- inconsistencias entre distintos archivos

Se utiliza sessionStorage porque el desafío:

- pertenece únicamente al intento actual de login
- no representa una sesión autenticada
- debe eliminarse al cerrar la pestaña
*/
const MFA_CHALLENGE_KEY = "green_acres_mfa_challenge";

/*
==================================================
TIPOS
==================================================
*/

/*
Representa la información mínima necesaria
para continuar el flujo de verificación MFA.

Contiene:

- el token temporal generado por backend
- el correo del administrador que inició sesión

Importante:

Este token NO es un JWT de sesión.

No permite acceder a rutas protegidas.

Solamente permite completar
la verificación del segundo factor.
*/
export type StoredMfaChallenge = {
  mfaChallengeToken: string;

  email: string;
};

/*
==================================================
HELPERS INTERNOS
==================================================
*/

/*
Valida que un valor recuperado
desde sessionStorage tenga
la estructura esperada.

Esto evita utilizar información:

- incompleta
- corrupta
- manipulada
- con tipos incorrectos
*/
const isStoredMfaChallenge = (
  value: unknown,
): value is StoredMfaChallenge => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const challenge = value as Record<string, unknown>;

  return (
    typeof challenge.mfaChallengeToken === "string" &&
    challenge.mfaChallengeToken.trim().length > 0 &&
    typeof challenge.email === "string" &&
    challenge.email.trim().length > 0
  );
};

/*
==================================================
OPERACIONES DE ALMACENAMIENTO
==================================================
*/

/*
Guarda temporalmente el desafío MFA.

Esta operación se ejecuta cuando:

- email y contraseña son válidos
- el administrador tiene MFA habilitado
- backend devuelve requiereMfa = true

No se guarda ninguna sesión definitiva
en este punto.
*/
export const saveMfaChallenge = (
  challenge: StoredMfaChallenge,
): void => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(
    MFA_CHALLENGE_KEY,
    JSON.stringify(challenge),
  );
};

/*
Recupera el desafío MFA pendiente.

Antes de devolverlo valida:

- que el código se ejecute en navegador
- que exista información guardada
- que el JSON pueda interpretarse
- que la estructura sea válida

Si la información es inválida,
se elimina automáticamente.
*/
export const getMfaChallenge = (): StoredMfaChallenge | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedChallenge = sessionStorage.getItem(MFA_CHALLENGE_KEY);

  if (!storedChallenge) {
    return null;
  }

  try {
    const parsedChallenge = JSON.parse(storedChallenge) as unknown;

    if (!isStoredMfaChallenge(parsedChallenge)) {
      clearMfaChallenge();

      return null;
    }

    return parsedChallenge;
  } catch {
    clearMfaChallenge();

    return null;
  }
};

/*
Elimina el desafío MFA temporal.

Se utiliza cuando:

- MFA fue verificado correctamente
- el usuario cancela el proceso
- el desafío guardado es inválido
- backend informa que el desafío venció
- se inicia un nuevo intento de login
*/
export const clearMfaChallenge = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(MFA_CHALLENGE_KEY);
};