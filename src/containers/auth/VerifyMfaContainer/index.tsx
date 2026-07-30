"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  clearMfaChallenge,
  getMfaChallenge,
} from "@/features/auth/utils/mfaChallengeStorage";

import { getAuthenticatedRedirectPath } from "@/features/auth/utils/authRedirect";

import { useAuth } from "@/hooks/auth/useAuth";
import { useAuthentication } from "@/hooks/auth/useAuthentication";

import { verifyMfaStyles } from "./verifyMfa.styles";

/*
==================================================
TIPOS
==================================================
*/

/*
Métodos disponibles para completar
el segundo factor de autenticación.

TOTP:

- utiliza el código de 6 dígitos
  generado por la aplicación autenticadora

RECOVERY:

- utiliza uno de los códigos de recuperación
  entregados al activar MFA
*/
type VerificationMethod = "TOTP" | "RECOVERY";

/*
==================================================
HELPERS DE EJECUCIÓN EN CLIENTE
==================================================
*/

/*
Suscripción estable utilizada por
useSyncExternalStore.

No existe una fuente externa que necesite
emitir cambios en tiempo real.

El hook se utiliza únicamente para
distinguir de forma segura entre:

- renderizado del servidor
- renderizado del navegador
*/
const subscribeToClientEnvironment = () => {
  return () => undefined;
};

/*
Snapshot utilizado cuando el componente
se encuentra ejecutándose en el navegador.
*/
const getClientSnapshot = () => true;

/*
Snapshot utilizado durante
el renderizado del servidor.
*/
const getServerSnapshot = () => false;

/*
==================================================
CONTAINER DE VERIFICACIÓN MFA
==================================================
*/

/*
Container encargado del segundo paso
del proceso de autenticación administrativa.

Responsabilidades:

- recuperar el desafío MFA pendiente
- solicitar un código TOTP o de recuperación
- validar los datos ingresados
- ejecutar la verificación mediante
  useAuthentication
- completar la sesión definitiva
- limpiar el desafío temporal
- redirigir al portal administrativo

Este container NO realiza llamadas
directas al backend.

Este container NO guarda directamente
la sesión autenticada.

Este container NO manipula directamente
sessionStorage.
*/
export default function VerifyMfaContainer() {
  /*
  Método seleccionado para completar
  el segundo factor.

  Por defecto se utiliza el código TOTP,
  ya que representa el flujo habitual.
  */
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>("TOTP");

  /*
  Código ingresado por el administrador.

  Puede representar:

  - código TOTP de 6 dígitos
  - código de recuperación
  */
  const [code, setCode] = useState("");

  /*
  Error de validación perteneciente
  exclusivamente a la interfaz.

  Los errores enviados por backend
  son administrados por useAuthentication.
  */
  const [validationError, setValidationError] = useState<string | null>(null);

  /*
  Router utilizado para regresar al login
  o continuar hacia el portal administrativo.
  */
  const router = useRouter();

  /*
  Permite identificar cuándo el componente
  ya está ejecutándose en el navegador.

  Esto evita acceder a sessionStorage
  durante el renderizado del servidor
  y evita actualizar estado dentro
  de un useEffect.
  */
  const isClient = useSyncExternalStore(
    subscribeToClientEnvironment,
    getClientSnapshot,
    getServerSnapshot,
  );

  /*
  Recupera el desafío MFA únicamente
  cuando existe acceso al navegador.

  mfaChallengeStorage mantiene encapsulado
  el acceso real a sessionStorage.
  */
  const challenge = isClient ? getMfaChallenge() : null;

  /*
  Sesión global actual.

  Permite evitar que un usuario
  ya autenticado permanezca dentro
  de la pantalla MFA.
  */
  const { user, token, isAuthReady } = useAuth();

  /*
  Hook responsable de completar
  la autenticación contra backend.

  El container solamente coordina
  el comportamiento visual.
  */
  const {
    handleVerifyMfa,
    handleVerifyMfaRecovery,
    isVerifyingMfa,
    error,
    clearFeedback,
  } = useAuthentication();

  /*
  Si el navegador ya está disponible,
  no existe un desafío MFA válido
  y tampoco existe una sesión definitiva,
  se regresa al inicio de sesión.

  La navegación utiliza replace
  para impedir volver mediante
  el historial a un flujo inválido.
  */
  useEffect(() => {
    if (!isClient) {
      return;
    }

    if (challenge) {
      return;
    }

    if (isAuthReady && user && token) {
      return;
    }

    router.replace("/");
  }, [
    isClient,
    challenge,
    isAuthReady,
    user,
    token,
    router,
  ]);

  /*
  Si ya existe una sesión definitiva,
  la verificación MFA dejó de ser necesaria.

  Se limpia cualquier desafío residual
  y se redirige según el rol autenticado.
  */
  useEffect(() => {
    if (!isAuthReady || !user || !token) {
      return;
    }

    clearMfaChallenge();

    const redirectPath = getAuthenticatedRedirectPath(user.rol);

    router.replace(redirectPath);
  }, [
    isAuthReady,
    user,
    token,
    router,
  ]);

  /*
  Determina si actualmente
  se está utilizando el código TOTP.
  */
  const isTotpMethod = verificationMethod === "TOTP";

  /*
  Actualiza el código ingresado.

  Para TOTP:

  - elimina cualquier carácter no numérico
  - limita el valor a 6 dígitos

  Para recuperación:

  - conserva el formato ingresado
  - elimina espacios al inicio
  */
  const handleCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = event.target.value;

    if (isTotpMethod) {
      const numericValue = nextValue
        .replace(/\D/g, "")
        .slice(0, 6);

      setCode(numericValue);
    } else {
      setCode(nextValue.trimStart());
    }

    if (validationError) {
      setValidationError(null);
    }

    if (error) {
      clearFeedback();
    }
  };

  /*
  Cambia entre:

  - código de aplicación autenticadora
  - código de recuperación

  Al cambiar de método se limpia:

  - código anterior
  - error visual
  - feedback del backend
  */
  const handleVerificationMethodChange = (
    nextMethod: VerificationMethod,
  ) => {
    setVerificationMethod(nextMethod);
    setCode("");
    setValidationError(null);
    clearFeedback();
  };

  /*
  Valida los datos antes de enviar
  la solicitud al backend.

  El frontend ofrece feedback inmediato,
  pero backend conserva siempre
  la validación definitiva.
  */
  const validateCode = (): boolean => {
    const normalizedCode = code.trim();

    if (!normalizedCode) {
      setValidationError(
        isTotpMethod
          ? "Ingresá el código de 6 dígitos."
          : "Ingresá un código de recuperación.",
      );

      return false;
    }

    if (
      isTotpMethod &&
      !/^\d{6}$/.test(normalizedCode)
    ) {
      setValidationError(
        "El código debe contener exactamente 6 dígitos.",
      );

      return false;
    }

    return true;
  };

  /*
  Envía el segundo factor seleccionado.

  Cuando la verificación es correcta:

  - useAuthentication guarda la sesión
    definitiva mediante AuthProvider
  - se elimina el desafío temporal
  - se redirige al portal administrativo
  */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setValidationError(null);
    clearFeedback();

    if (!challenge || !validateCode()) {
      return;
    }

    const normalizedCode = code.trim();

    const response = isTotpMethod
      ? await handleVerifyMfa(
          challenge.mfaChallengeToken,
          normalizedCode,
        )
      : await handleVerifyMfaRecovery(
          challenge.mfaChallengeToken,
          normalizedCode,
        );

    if (!response) {
      return;
    }

    clearMfaChallenge();

    const redirectPath = getAuthenticatedRedirectPath(
      response.usuario.rol,
    );

    router.replace(redirectPath);
  };

  /*
  Cancela el desafío MFA actual.

  Se elimina toda la información temporal
  y se regresa al login para comenzar
  nuevamente el proceso.
  */
  const handleCancel = () => {
    clearMfaChallenge();
    clearFeedback();

    router.replace("/");
  };

  /*
  Mientras se resuelve el entorno cliente
  o se procesa una redirección por ausencia
  de desafío, se presenta un estado neutral.

  Esto evita mostrar un formulario inválido
  o generar saltos visuales.
  */
  if (!isClient || !challenge) {
    return (
      <Box component="main" sx={verifyMfaStyles.page}>
        <Container
          maxWidth={false}
          sx={verifyMfaStyles.container}
        >
          <Typography
            role="status"
            aria-live="polite"
            sx={verifyMfaStyles.loadingText}
          >
            Verificando el acceso...
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box component="main" sx={verifyMfaStyles.page}>
      <Container
        maxWidth={false}
        sx={verifyMfaStyles.container}
      >
        <Stack
          spacing={1.2}
          sx={verifyMfaStyles.brandWrapper}
        >
          <Box sx={verifyMfaStyles.brandIcon}>
            G
          </Box>

          <Box>
            <Typography
              component="p"
              variant="h4"
              sx={verifyMfaStyles.brandTitle}
            >
              Green Acres
            </Typography>

            <Typography
              variant="body2"
              sx={verifyMfaStyles.brandSubtitle}
            >
              Gestión inteligente para clubes
            </Typography>
          </Box>
        </Stack>

        <Paper
          elevation={0}
          sx={verifyMfaStyles.card}
        >
          <Stack
            component="form"
            spacing={2}
            onSubmit={handleSubmit}
            noValidate
          >
            <Box>
              <Typography
                component="h1"
                variant="h5"
                sx={verifyMfaStyles.cardTitle}
              >
                Verificación en dos pasos
              </Typography>

              <Typography
                variant="body2"
                sx={verifyMfaStyles.cardSubtitle}
              >
                {isTotpMethod
                  ? "Ingresá el código generado por tu aplicación autenticadora."
                  : "Ingresá uno de tus códigos de recuperación disponibles."}
              </Typography>
            </Box>

            <Box sx={verifyMfaStyles.accountBox}>
              <Typography
                variant="caption"
                sx={verifyMfaStyles.accountLabel}
              >
                Cuenta administrativa
              </Typography>

              <Typography
                variant="body2"
                sx={verifyMfaStyles.accountEmail}
              >
                {challenge.email}
              </Typography>
            </Box>

            <Stack spacing={0.8}>
              <Typography
                component="label"
                htmlFor="mfa-code"
                variant="body2"
                sx={verifyMfaStyles.fieldLabel}
              >
                {isTotpMethod
                  ? "Código de verificación"
                  : "Código de recuperación"}
              </Typography>

              <TextField
                id="mfa-code"
                name="mfaCode"
                type="text"
                fullWidth
                autoFocus
                autoComplete="one-time-code"
                placeholder={
                  isTotpMethod
                    ? "000000"
                    : "Ingresá tu código de recuperación"
                }
                value={code}
                onChange={handleCodeChange}
                disabled={isVerifyingMfa}
                error={Boolean(validationError)}
                slotProps={{
                  htmlInput: {
                    inputMode: isTotpMethod
                      ? "numeric"
                      : "text",
                    maxLength: isTotpMethod
                      ? 6
                      : undefined,
                    "aria-describedby": validationError
                      ? "mfa-validation-error"
                      : undefined,
                    "aria-invalid": Boolean(validationError),
                  },
                }}
                sx={
                  isTotpMethod
                    ? verifyMfaStyles.codeInput
                    : verifyMfaStyles.recoveryInput
                }
              />

              {validationError && (
                <Typography
                  id="mfa-validation-error"
                  role="alert"
                  variant="caption"
                  sx={verifyMfaStyles.validationError}
                >
                  {validationError}
                </Typography>
              )}
            </Stack>

            {error && (
              <Alert
                severity="error"
                sx={verifyMfaStyles.errorAlert}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isVerifyingMfa}
              sx={verifyMfaStyles.submitButton}
            >
              {isVerifyingMfa
                ? "Verificando..."
                : "Verificar y continuar"}
            </Button>

            <Button
              type="button"
              variant="text"
              fullWidth
              disabled={isVerifyingMfa}
              onClick={() =>
                handleVerificationMethodChange(
                  isTotpMethod
                    ? "RECOVERY"
                    : "TOTP",
                )
              }
              sx={verifyMfaStyles.alternativeButton}
            >
              {isTotpMethod
                ? "Usar un código de recuperación"
                : "Usar la aplicación autenticadora"}
            </Button>

            <Link
              component="button"
              type="button"
              underline="none"
              disabled={isVerifyingMfa}
              onClick={handleCancel}
              sx={verifyMfaStyles.cancelLink}
            >
              Volver al inicio de sesión
            </Link>

            <Box sx={verifyMfaStyles.securityBox}>
              <Typography
                variant="subtitle2"
                sx={verifyMfaStyles.securityTitle}
              >
                Acceso protegido
              </Typography>

              <Typography
                variant="body2"
                sx={verifyMfaStyles.securityDescription}
              >
                El código confirma que sos vos quien está
                intentando acceder a la cuenta administrativa.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}