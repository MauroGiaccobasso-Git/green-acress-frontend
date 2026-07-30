import { httpClient } from "./httpClient";

/*
==================================================
TIPOS COMPARTIDOS
==================================================
*/

/*
Roles disponibles dentro del sistema.

Mantener este tipo centralizado evita:

- repetir strings mágicos

- inconsistencias entre respuestas

- errores de tipado en hooks y containers
*/
export type AuthRole = "ADMIN" | "SOCIO";

/*
Estados posibles del usuario.

Estos estados pertenecen al modelo Usuario,
no al estado funcional del socio.
*/
export type AuthUserStatus = "ACTIVO" | "INACTIVO" | "BLOQUEADO";

/*
Información completa del usuario autenticado.

Esta estructura se recibe únicamente
cuando backend entrega una sesión válida.

Incluye el estado de MFA necesario
para reconstruir correctamente la sesión
y mostrar su configuración actual.
*/
export type AuthUser = {
  id: number;
  email: string;
  rol: AuthRole;
  estado: AuthUserStatus;
  mfaHabilitado: boolean;
};

/*
Información mínima enviada durante
un desafío MFA.

En esta etapa todavía no existe
una sesión JWT definitiva.
*/
export type MfaChallengeUser = {
  email: string;
  rol: "ADMIN";
};

/*
Respuesta común utilizada por operaciones
que únicamente devuelven confirmación.
*/
export type AuthMessageResponse = {
  message: string;
};

/*
Respuesta obtenida luego
de aceptar el consentimiento informado.
*/
export type AcceptConsentResponse = {
  message: string;
  socio: unknown;
};

/*
==================================================
LOGIN
==================================================
*/

/*
Credenciales requeridas para iniciar sesión.
*/
export type LoginRequest = {
  email: string;
  password: string;
};

/*
Respuesta de login autenticado.

Se devuelve cuando:

- las credenciales son válidas

- no existe MFA pendiente

- no existe cambio obligatorio de contraseña
*/
export type LoginSuccessResponse = {
  message: string;
  token: string;
  requiereConsentimiento: boolean;
  usuario: AuthUser;
};

/*
Respuesta de login que requiere MFA.

Backend todavía no entrega token JWT definitivo.

El token recibido representa únicamente
un desafío temporal de autenticación.
*/
export type LoginMfaRequiredResponse = {
  message: string;
  requiereMfa: true;
  mfaChallengeToken: string;
  usuario: MfaChallengeUser;
};

/*
Respuesta de login que requiere
cambio obligatorio de contraseña temporal.

Backend no entrega sesión todavía.

El usuario debe completar
el primer acceso antes de continuar.
*/
export type LoginPasswordChangeRequiredResponse = {
  message: string;
  code: "AUTH_PASSWORD_CHANGE_REQUIRED";
};

/*
Unión de resultados válidos posibles
del endpoint login.

Esto permite que los hooks discriminen
el flujo mediante requiereMfa
sin utilizar propiedades inexistentes.
*/
export type LoginResponse =
  | LoginSuccessResponse
  | LoginMfaRequiredResponse
  | LoginPasswordChangeRequiredResponse;

/*
Helper de tipo para identificar
una respuesta que requiere MFA.
*/
export function isMfaRequiredResponse(
  response: LoginResponse,
): response is LoginMfaRequiredResponse {
  return "requiereMfa" in response && response.requiereMfa === true;
}

/*
==================================================
VERIFICACIÓN MFA
==================================================
*/

/*
Datos requeridos para completar
el desafío MFA mediante código TOTP.
*/
export type VerifyMfaRequest = {
  mfaChallengeToken: string;
  codigo: string;
};

/*
Datos requeridos para completar
el desafío MFA mediante un código
de recuperación de un solo uso.
*/
export type VerifyMfaRecoveryRequest = {
  mfaChallengeToken: string;
  codigo: string;
};

/*
Respuesta exitosa luego de completar MFA.

En este punto backend entrega
la sesión JWT definitiva.
*/
export type VerifyMfaResponse = {
  message: string;
  token: string;
  requiereMfa: false;
  usuario: AuthUser;
};

/*
==================================================
CONTRASEÑA TEMPORAL
==================================================
*/

/*
Datos requeridos para reemplazar
una contraseña temporal por una definitiva.

Este endpoint no requiere JWT porque
el usuario todavía no posee acceso completo.
*/
export type ChangeTemporaryPasswordRequest = {
  email: string;
  passwordActual: string;
  nuevaPassword: string;
};

/*
==================================================
RECUPERACIÓN DE CONTRASEÑA
==================================================
*/

/*
Datos necesarios para iniciar
la recuperación de contraseña.
*/
export type RequestPasswordRecoveryRequest = {
  email: string;
};

/*
Datos requeridos para restablecer
la contraseña mediante el token
recibido por correo electrónico.
*/
export type ResetPasswordRequest = {
  token: string;
  nuevaPassword: string;
};
/*
==================================================
CONFIGURACIÓN MFA
==================================================
*/

/*
Respuesta obtenida al iniciar
la configuración MFA.

La clave se presenta manualmente
por decisión funcional del proyecto.

No se utiliza código QR.
*/
export type ConfigureMfaResponse = {
  message: string;
  secreto: string;
  codigosRecuperacion: string[];
};

/*
Datos requeridos para confirmar
y activar MFA.
*/
export type ConfirmMfaRequest = {
  codigo: string;
};

/*
Datos requeridos para desactivar MFA.

La operación requiere doble confirmación:

- contraseña actual del administrador

- código TOTP vigente generado
  por la aplicación autenticadora

Backend elimina la configuración MFA
únicamente luego de validar ambos datos.
*/
export type DisableMfaRequest = {
  passwordActual: string;
  codigo: string;
};

/*
==================================================
API DE AUTENTICACIÓN
==================================================
*/

/*
Módulo encargado de centralizar
todas las comunicaciones relacionadas
con autenticación y seguridad.

Responsabilidades:

- encapsular endpoints

- tipar requests y responses

- delegar la comunicación a httpClient

- evitar URLs repetidas en hooks

Los containers NO deben consumir
este módulo directamente.

La arquitectura esperada es:

Container

↓

Hook

↓

authApi

↓

httpClient

↓

Backend
*/
export const authApi = {

  /*
  Inicia sesión mediante email
  y contraseña.
  */
  login(credentials: LoginRequest) {
    return httpClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: credentials,
    });
  },


  /*
  Completa el segundo factor
  utilizando un código TOTP.
  */
  verifyMfa(data: VerifyMfaRequest) {
    return httpClient<VerifyMfaResponse>("/auth/verificar-mfa", {
      method: "POST",
      body: data,
    });
  },


  /*
  Completa el segundo factor
  utilizando un código de recuperación.
  */
  verifyMfaRecovery(data: VerifyMfaRecoveryRequest) {
    return httpClient<VerifyMfaResponse>(
      "/auth/verificar-mfa-recuperacion",
      {
        method: "POST",
        body: data,
      },
    );
  },


  /*
  Sustituye una contraseña temporal
  por una contraseña definitiva.
  */
  changeTemporaryPassword(data: ChangeTemporaryPasswordRequest) {
    return httpClient<AuthMessageResponse>(
      "/auth/cambiar-password",
      {
        method: "POST",
        body: data,
      },
    );
  },


  /*
  Inicia recuperación de contraseña.
  */
  requestPasswordRecovery(data: RequestPasswordRecoveryRequest) {
    return httpClient<AuthMessageResponse>(
      "/auth/recuperar-password",
      {
        method: "POST",
        body: data,
      },
    );
  },


  /*
  Restablece contraseña mediante token.
  */
  resetPassword(data: ResetPasswordRequest) {
    return httpClient<AuthMessageResponse>(
      "/auth/restablecer-password",
      {
        method: "POST",
        body: data,
      },
    );
  },


  /*
  Inicia configuración MFA
  para administrador autenticado.
  */
  configureMfa() {
    return httpClient<ConfigureMfaResponse>(
      "/auth/mfa/configurar",
      {
        method: "POST",
      },
    );
  },


  /*
  Confirma y activa MFA mediante
  código TOTP.
  */
  confirmMfa(data: ConfirmMfaRequest) {
    return httpClient<AuthMessageResponse>(
      "/auth/mfa/confirmar",
      {
        method: "POST",
        body: data,
      },
    );
  },


  /*
  Desactiva MFA para administrador autenticado.

  Backend valida:

  - sesión ADMIN válida

  - contraseña actual

  - código TOTP vigente


  Luego:

  - elimina secreto MFA

  - elimina códigos recuperación

  - invalida sesiones anteriores

  - registra auditoría


  La operación requiere confirmación adicional
  porque reduce el nivel de seguridad
  de la cuenta.
  */
  disableMfa(data: DisableMfaRequest) {
    return httpClient<AuthMessageResponse>(
      "/auth/mfa/desactivar",
      {
        method: "POST",
        body: data,
      },
    );
  },


  /*
  Cierra la sesión actual
  en backend.

  Este endpoint incrementa
  la versión de sesión del usuario
  e invalida los JWT anteriores.
  */
  logout() {
    return httpClient<AuthMessageResponse>(
      "/auth/logout",
      {
        method: "POST",
      },
    );
  },


  /*
  Acepta el consentimiento informado
  del socio autenticado.
  */
  acceptConsent() {
    return httpClient<AcceptConsentResponse>(
      "/socios/consentimiento",
      {
        method: "PATCH",
      },
    );
  },

};