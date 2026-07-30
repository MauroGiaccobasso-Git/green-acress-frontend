import { useState } from "react";

import {
  authApi,
  isMfaRequiredResponse,
  type AuthMessageResponse,
  type ConfigureMfaResponse,
  type LoginResponse,
  type VerifyMfaResponse,
} from "@/api/authApi";

import { HttpError } from "@/api/httpClient";

import { useAuth } from "./useAuth";

/*
==================================================
TIPOS
==================================================
*/

/*
Resultado posible del proceso de login.

Puede contener:

- una sesión autenticada
- un desafío MFA pendiente
- un código funcional especial
- null cuando ocurre un error
*/
type HandleLoginResult =
  | LoginResponse
  | {
      code: string;
    }
  | null;

/*
Resultado posible al completar
una verificación MFA.

Puede contener:

- la sesión autenticada definitiva
- null cuando ocurre un error
*/
type HandleVerifyMfaResult = VerifyMfaResponse | null;

/*
Resultado posible al solicitar
la recuperación de contraseña.

Puede contener:

- el mensaje genérico del backend
- null cuando ocurre un error
*/
type HandlePasswordRecoveryResult = AuthMessageResponse | null;

/*
Resultado posible al restablecer
una contraseña mediante token.

Puede contener:

- el mensaje de confirmación del backend
- null cuando ocurre un error
*/
type HandleResetPasswordResult = AuthMessageResponse | null;

/*
Resultado posible al cambiar
una contraseña temporal.

Puede contener:

- el mensaje de confirmación del backend
- null cuando ocurre un error
*/
type HandleChangeTemporaryPasswordResult = AuthMessageResponse | null;

/*
Resultado posible al aceptar
el consentimiento informado.

Puede contener:

- el mensaje de confirmación del backend
- null cuando ocurre un error
*/
type HandleAcceptConsentimientoResult = AuthMessageResponse | null;

/*
Resultado posible al iniciar
la configuración MFA.

Puede contener:

- secreto para la aplicación autenticadora
- códigos de recuperación
- mensaje del backend
- null cuando ocurre un error
*/
type HandleConfigureMfaResult = ConfigureMfaResponse | null;

/*
Resultado posible al confirmar
la activación MFA.

Puede contener:

- mensaje de confirmación del backend
- null cuando ocurre un error
*/
type HandleConfirmMfaResult = AuthMessageResponse | null;

/*
Resultado posible al desactivar MFA.

Puede contener:

- el mensaje de confirmación del backend
- null cuando ocurre un error
*/
type HandleDisableMfaResult = AuthMessageResponse | null;

/*
==================================================
HOOK DE AUTENTICACIÓN
==================================================
*/

/*
Hook principal del dominio
de autenticación.

Su responsabilidad es coordinar
la comunicación entre:

- la interfaz de usuario
- el backend
- AuthProvider

Este hook NO renderiza interfaz.

Este hook NO realiza llamadas
directamente mediante httpClient.

Este hook NO decide redirecciones.

Toda la comunicación con el backend
se realiza mediante authApi.

Actualmente administra:

- inicio de sesión
- detección de desafío MFA
- verificación mediante código TOTP
- verificación mediante código de recuperación
- configuración inicial de MFA
- confirmación y activación de MFA
- solicitud de recuperación de contraseña
- restablecimiento de contraseña mediante token
- cambio de contraseña temporal
- aceptación de consentimiento informado
- persistencia de la sesión
- estados de carga
- manejo de errores
- mensajes de confirmación
*/
export function useAuthentication() {
  /*
  Obtiene las acciones necesarias
  desde el contexto global
  de autenticación.

  login se utiliza con un alias
  para evitar confundirla
  con authApi.login.
  */
  const { login: saveAuthenticatedSession, updateUser, logout } = useAuth();

  /*
  Indica si el proceso inicial
  de login se encuentra en ejecución.
  */
  const [isLoading, setIsLoading] = useState(false);

  /*
  Indica si se está verificando
  un segundo factor de autenticación.

  Se comparte entre:

  - código TOTP
  - código de recuperación

  Ambos representan alternativas
  del mismo proceso funcional.
  */
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);

  /*
  Indica si se está iniciando
  la configuración MFA.

  Durante esta operación backend:

  - genera un secreto;
  - reemplaza configuraciones pendientes;
  - genera códigos de recuperación;
  - mantiene MFA deshabilitado.
  */
  const [isConfiguringMfa, setIsConfiguringMfa] = useState(false);

  /*
  Indica si se está confirmando
  la activación MFA mediante
  un código TOTP.
  */
  const [isConfirmingMfa, setIsConfirmingMfa] = useState(false);

  /*
  Indica si se está desactivando MFA.
  */
  const [isDisablingMfa, setIsDisablingMfa] = useState(false);

  /*
  Indica si la solicitud de recuperación
  de contraseña se encuentra en ejecución.
  */
  const [isRequestingPasswordRecovery, setIsRequestingPasswordRecovery] =
    useState(false);

  /*
  Indica si el restablecimiento
  de contraseña se encuentra
  en ejecución.
  */
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  /*
  Indica si el cambio de contraseña
  temporal se encuentra en ejecución.
  */
  const [isChangingTemporaryPassword, setIsChangingTemporaryPassword] =
    useState(false);

  /*
  Indica si la aceptación
  del consentimiento informado
  se encuentra en ejecución.
  */
  const [isAcceptingConsentimiento, setIsAcceptingConsentimiento] =
    useState(false);

  /*
  Mensaje de error producido
  durante una operación.

  Si la operación funciona correctamente,
  este valor queda en null.
  */
  const [error, setError] = useState<string | null>(null);

  /*
  Código funcional devuelto por backend.

  Permite distinguir errores especiales
  sin depender del texto del mensaje.
  */
  const [errorCode, setErrorCode] = useState<string | null>(null);

  /*
  Mensaje de confirmación producido
  por una operación exitosa.
  */
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /*
  ==================================================
  HELPERS INTERNOS
  ==================================================
  */

  /*
  Limpia todo el feedback anterior.

  Se utiliza antes de comenzar
  cualquier operación nueva.
  */
  const resetFeedback = () => {
    setError(null);
    setErrorCode(null);
    setSuccessMessage(null);
  };

  /*
  Registra dentro del estado del hook
  un error producido por una operación.

  Conserva:

  - mensaje legible
  - código funcional cuando existe

  Retorna siempre null para simplificar
  los métodos que utilizan este helper.
  */
  const handleOperationError = (
    caughtError: unknown,
    fallbackMessage: string,
  ): null => {
    if (caughtError instanceof HttpError) {
      setError(caughtError.message);
      setErrorCode(caughtError.code ?? null);

      return null;
    }

    const message =
      caughtError instanceof Error ? caughtError.message : fallbackMessage;

    setError(message);
    setErrorCode(null);

    return null;
  };

  /*
  Guarda la sesión definitiva
  entregada luego de verificar MFA.

  MFA sólo aplica a usuarios ADMIN,
  por lo que no existe consentimiento
  informado pendiente en este flujo.
  */
  const saveMfaAuthenticatedSession = (response: VerifyMfaResponse): void => {
    saveAuthenticatedSession(
      {
        ...response.usuario,
        requiereConsentimiento: false,
      },
      response.token,
    );
  };

  /*
  Ejecuta una verificación MFA
  utilizando el método recibido.

  Centraliza el comportamiento compartido
  entre:

  - código TOTP
  - código de recuperación

  Evita duplicar:

  - estados de carga
  - limpieza de feedback
  - persistencia de sesión
  - manejo de errores
  */
  const executeMfaVerification = async (
    verificationRequest: () => Promise<VerifyMfaResponse>,
    fallbackMessage: string,
  ): Promise<HandleVerifyMfaResult> => {
    setIsVerifyingMfa(true);

    resetFeedback();

    try {
      const response = await verificationRequest();

      saveMfaAuthenticatedSession(response);

      return response;
    } catch (caughtError) {
      return handleOperationError(caughtError, fallbackMessage);
    } finally {
      setIsVerifyingMfa(false);
    }
  };

  /*
  ==================================================
  LOGIN
  ==================================================
  */

  /*
  Ejecuta el proceso inicial
  de autenticación.

  Recibe email y password desde
  el formulario visual.

  Luego llama a authApi, que es
  la capa encargada de comunicarse
  con el backend.
  */
  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<HandleLoginResult> => {
    setIsLoading(true);

    resetFeedback();

    try {
      const response = await authApi.login({
        email,
        password,
      });

      /*
      Si backend solicita MFA,
      todavía no existe una sesión
      autenticada definitiva.

      Por lo tanto:

      - no se llama al AuthProvider
      - no se guarda token de sesión
      - se devuelve el desafío al container
      */
      if (isMfaRequiredResponse(response)) {
        return response;
      }

      /*
      Si la respuesta no contiene
      una sesión definitiva,
      se devuelve al container
      para que gestione el flujo especial.
      */
      if (!("usuario" in response) || !("token" in response)) {
        return response;
      }

      /*
Backend entregó una sesión
autenticada definitiva.

Se guarda mediante AuthProvider.
*/
      saveAuthenticatedSession(
        {
          ...response.usuario,
          requiereConsentimiento: response.requiereConsentimiento,
          mfaHabilitado: response.usuario.mfaHabilitado,
        },
        response.token,
      );

      return response;
    } catch (caughtError) {
      /*
      El cambio obligatorio
      de contraseña necesita ser devuelto
      al container como resultado funcional.

      Todavía no existe sesión autenticada.
      */
      if (
        caughtError instanceof HttpError &&
        caughtError.code === "AUTH_PASSWORD_CHANGE_REQUIRED"
      ) {
        setError(caughtError.message);
        setErrorCode(caughtError.code);

        return {
          code: caughtError.code,
        };
      }

      return handleOperationError(caughtError, "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  /*
  ==================================================
  VERIFICACIÓN MFA
  ==================================================
  */

  /*
  Completa el segundo factor
  mediante un código TOTP
  generado por la aplicación autenticadora.

  Backend valida:

  - existencia del desafío
  - vigencia del desafío
  - cantidad de intentos
  - formato del código
  - validez del código TOTP

  Si la verificación es correcta,
  se guarda la sesión definitiva
  mediante AuthProvider.
  */
  const handleVerifyMfa = async (
    mfaChallengeToken: string,
    code: string,
  ): Promise<HandleVerifyMfaResult> => {
    return executeMfaVerification(
      () =>
        authApi.verifyMfa({
          mfaChallengeToken,
          codigo: code,
        }),
      "No se pudo verificar el código de autenticación",
    );
  };

  /*
  Completa el segundo factor
  mediante un código de recuperación.

  Backend conserva la responsabilidad de:

  - validar el desafío
  - validar el código de recuperación
  - impedir su reutilización
  - marcarlo como consumido

  Si la verificación es correcta,
  se guarda la sesión definitiva
  mediante AuthProvider.
  */
  const handleVerifyMfaRecovery = async (
    mfaChallengeToken: string,
    code: string,
  ): Promise<HandleVerifyMfaResult> => {
    return executeMfaVerification(
      () =>
        authApi.verifyMfaRecovery({
          mfaChallengeToken,
          codigo: code,
        }),
      "No se pudo verificar el código de recuperación",
    );
  };

  /*
  ==================================================
  CONFIGURACIÓN MFA
  ==================================================
  */

  /*
  Inicia la configuración MFA
  para el administrador autenticado.

  Backend conserva la responsabilidad de:

  - validar que el usuario exista;
  - validar que sea ADMIN;
  - validar que esté ACTIVO;
  - impedir sobrescribir MFA habilitado;
  - generar el secreto;
  - cifrar el secreto;
  - generar códigos de recuperación;
  - guardar únicamente sus hashes;
  - reemplazar configuraciones pendientes;
  - registrar auditoría.

  El secreto y los códigos devueltos
  deben mostrarse al administrador
  porque no podrán recuperarse
  posteriormente desde backend.
  */
  const handleConfigureMfa = async (): Promise<HandleConfigureMfaResult> => {
    setIsConfiguringMfa(true);

    resetFeedback();

    try {
      const response = await authApi.configureMfa();

      setSuccessMessage(response.message);

      return response;
    } catch (caughtError) {
      return handleOperationError(
        caughtError,
        "No se pudo iniciar la configuración MFA",
      );
    } finally {
      setIsConfiguringMfa(false);
    }
  };

  /*
  Confirma y activa MFA utilizando
  un código TOTP generado por
  la aplicación autenticadora.

  Backend conserva la responsabilidad de:

  - validar que exista configuración pendiente;
  - descifrar el secreto;
  - validar el código TOTP;
  - habilitar MFA;
  - registrar auditoría.

  Esta operación no utiliza challenge token
  porque el administrador ya posee
  una sesión JWT válida.
  */
  const handleConfirmMfa = async (
    code: string,
  ): Promise<HandleConfirmMfaResult> => {
    setIsConfirmingMfa(true);

    resetFeedback();

    try {
      const response = await authApi.confirmMfa({
        codigo: code,
      });

      updateUser({
        mfaHabilitado: true,
      });

      setSuccessMessage(response.message);

      return response;
    } catch (caughtError) {
      return handleOperationError(
        caughtError,
        "No se pudo confirmar la activación MFA",
      );
    } finally {
      setIsConfirmingMfa(false);
    }
  };

  /*
  Desactiva MFA para el administrador autenticado.

  Backend conserva la responsabilidad de:

  - validar contraseña actual;
  - validar código TOTP vigente;
  - eliminar configuración MFA;
  - eliminar códigos de recuperación;
  - invalidar sesiones anteriores;
  - registrar auditoría.

  Como backend revoca la sesión actual,
  frontend limpia la sesión local para
  evitar conservar un token inválido.

  Esta operación no utiliza challenge token
  porque el administrador ya posee
  una sesión JWT válida.
  */
  const handleDisableMfa = async (
    passwordActual: string,
    codigo: string,
  ): Promise<HandleDisableMfaResult> => {
    setIsDisablingMfa(true);

    resetFeedback();

    try {
      const response = await authApi.disableMfa({
        passwordActual,
        codigo,
      });

      setSuccessMessage(response.message);

      logout();

      return response;
    } catch (caughtError) {
      return handleOperationError(
        caughtError,
        "No se pudo desactivar MFA",
      );
    } finally {
      setIsDisablingMfa(false);
    }
  };

  /*
  ==================================================
  RECUPERACIÓN DE CONTRASEÑA
  ==================================================
  */

  /*
  Inicia la recuperación de contraseña
  mediante el correo ingresado
  por el usuario.

  Backend devuelve siempre una respuesta
  genérica para evitar enumeración
  de usuarios registrados.
  */
  const handleRequestPasswordRecovery = async (
    email: string,
  ): Promise<HandlePasswordRecoveryResult> => {
    setIsRequestingPasswordRecovery(true);

    resetFeedback();

    try {
      const response = await authApi.requestPasswordRecovery({
        email,
      });

      setSuccessMessage(response.message);

      return response;
    } catch (caughtError) {
      return handleOperationError(
        caughtError,
        "No se pudo iniciar la recuperación de contraseña",
      );
    } finally {
      setIsRequestingPasswordRecovery(false);
    }
  };

  /*
  Restablece la contraseña mediante
  el token recibido por correo.

  Backend conserva la responsabilidad de:

  - validar existencia del token
  - validar expiración
  - validar uso único
  - validar la política de contraseña
  - invalidar sesiones anteriores
  */
  const handleResetPassword = async (
    token: string,
    newPassword: string,
  ): Promise<HandleResetPasswordResult> => {
    setIsResettingPassword(true);

    resetFeedback();

    try {
      const response = await authApi.resetPassword({
        token,
        nuevaPassword: newPassword,
      });

      setSuccessMessage(response.message);

      return response;
    } catch (caughtError) {
      return handleOperationError(
        caughtError,
        "No se pudo restablecer la contraseña",
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  /*
  ==================================================
  CONTRASEÑA TEMPORAL
  ==================================================
  */

  /*
  Cambia una contraseña temporal
  por una contraseña definitiva.

  Backend conserva la responsabilidad de:

  - validar contraseña actual
  - validar expiración de contraseña temporal
  - validar política de contraseña nueva
  - actualizar flags relacionados
    al primer acceso
  */
  const handleChangeTemporaryPassword = async (
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<HandleChangeTemporaryPasswordResult> => {
    setIsChangingTemporaryPassword(true);

    resetFeedback();

    try {
      const response = await authApi.changeTemporaryPassword({
        email,
        passwordActual: currentPassword,
        nuevaPassword: newPassword,
      });

      setSuccessMessage(response.message);

      return response;
    } catch (caughtError) {
      return handleOperationError(
        caughtError,
        "No se pudo cambiar la contraseña temporal",
      );
    } finally {
      setIsChangingTemporaryPassword(false);
    }
  };

  /*
  ==================================================
  CONSENTIMIENTO INFORMADO
  ==================================================
  */

  /*
  Acepta el consentimiento informado
  del socio autenticado.

  Backend conserva la responsabilidad de:

  - registrar aceptación
  - guardar fecha de aceptación
  - actualizar estado del consentimiento
  */
  const handleAcceptConsentimiento =
    async (): Promise<HandleAcceptConsentimientoResult> => {
      setIsAcceptingConsentimiento(true);

      resetFeedback();

      try {
        const response = await authApi.acceptConsent();

        updateUser({
          requiereConsentimiento: false,
        });

        setSuccessMessage(response.message);

        return response;
      } catch (caughtError) {
        return handleOperationError(
          caughtError,
          "No se pudo aceptar el consentimiento informado",
        );
      } finally {
        setIsAcceptingConsentimiento(false);
      }
    };

  /*
  ==================================================
  FEEDBACK
  ==================================================
  */

  /*
  Limpia manualmente el feedback actual.

  Puede utilizarse cuando:

  - el usuario modifica nuevamente un campo
  - se cambia de paso dentro del flujo
  - se cierra un mensaje visual
  - se inicia una nueva operación
  */
  const clearFeedback = () => {
    resetFeedback();
  };

  /*
  ==================================================
  API PÚBLICA DEL HOOK
  ==================================================
  */

  /*
  Expone las operaciones y estados
  necesarios para los distintos
  containers de autenticación.
  */
  return {
    handleLogin,
    handleVerifyMfa,
    handleVerifyMfaRecovery,

    handleConfigureMfa,
    handleConfirmMfa,
    handleDisableMfa,

    handleRequestPasswordRecovery,
    handleResetPassword,
    handleChangeTemporaryPassword,
    handleAcceptConsentimiento,

    isLoading,
    isVerifyingMfa,

    isConfiguringMfa,
    isConfirmingMfa,
    isDisablingMfa,

    isRequestingPasswordRecovery,
    isResettingPassword,
    isChangingTemporaryPassword,
    isAcceptingConsentimiento,

    error,
    errorCode,
    successMessage,

    clearFeedback,
  };
}