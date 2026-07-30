"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import type { ConfigureMfaResponse } from "@/api/authApi";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAuthentication } from "@/hooks/auth/useAuthentication";

import { settingsStyles } from "./settings.styles";

/*
==================================================
TIPOS
==================================================
*/

/*
Pasos visuales correspondientes
al flujo de activación MFA.

IDLE:
MFA todavía no fue configurado durante
la sesión actual.

CONFIGURATION:
Backend generó el secreto y los códigos
de recuperación.

COMPLETED:
El administrador confirmó correctamente
el código TOTP y MFA quedó habilitado.
*/
type MfaSetupStep = "IDLE" | "CONFIGURATION" | "COMPLETED";

/*
==================================================
HELPERS
==================================================
*/

/*
Oculta parcialmente el secreto MFA
cuando todavía no fue solicitado mostrarlo.

El valor completo permanece disponible
para copiarlo mediante una acción explícita.
*/
function maskSecret(secret: string) {
  if (secret.length <= 8) {
    return "••••••••";
  }

  return `${secret.slice(0, 4)}${"•".repeat(
    Math.max(secret.length - 8, 8),
  )}${secret.slice(-4)}`;
}

/*
==================================================
CONTAINER PRINCIPAL
==================================================
*/

/*
Container correspondiente a la configuración
administrativa del sistema.

Responsabilidades actuales:

- mostrar el estado de seguridad de la cuenta;
- informar si MFA se encuentra habilitado;
- iniciar la configuración MFA;
- presentar el secreto manual;
- presentar códigos de recuperación;
- validar preventivamente el código TOTP;
- confirmar la activación mediante el hook;
- ofrecer acciones seguras de copiado;
- administrar únicamente estado visual local.

Este container NO:

- llama directamente a authApi;
- accede a httpClient;
- persiste secretos MFA;
- persiste códigos de recuperación;
- valida códigos de forma definitiva;
- implementa reglas críticas de seguridad.

Toda comunicación con backend se delega
a useAuthentication.
*/
export default function SettingsContainer() {
  /*
  Usuario autenticado y estado de inicialización
  de la sesión global.

  mfaHabilitado representa el estado real
  recibido desde backend y persistido
  por AuthProvider.
  */
  const { user, isAuthReady } = useAuth();

  /*
  Hook orquestador del dominio
  de autenticación y seguridad.
  */
  const {
    handleConfigureMfa,
    handleConfirmMfa,
    handleDisableMfa,

    isConfiguringMfa,
    isConfirmingMfa,
    isDisablingMfa,

    error,
    successMessage,

    clearFeedback,
  } = useAuthentication();

  /*
  Información temporal devuelta
  al iniciar la configuración MFA.

  Se mantiene únicamente en memoria
  durante la vida del componente.

  No se guarda en localStorage,
  sessionStorage ni cookies.
  */
  const [mfaConfiguration, setMfaConfiguration] =
    useState<ConfigureMfaResponse | null>(null);

  /*
  Paso actual del flujo visual.
  */
  const [setupStep, setSetupStep] = useState<MfaSetupStep>("IDLE");

  /*
  Código TOTP ingresado para confirmar
  la configuración.
  */
  const [verificationCode, setVerificationCode] = useState("");
  const verificationFormRef = useRef<HTMLDivElement | null>(null);

  /*
  Error correspondiente exclusivamente
  a validaciones preventivas de interfaz.
  */
  const [validationError, setValidationError] = useState<string | null>(null);

  /*
  Contraseña actual solicitada para
  confirmar la desactivación MFA.
  */
  const [disableMfaPassword, setDisableMfaPassword] = useState("");

  /*
  Código TOTP solicitado para confirmar
  la desactivación MFA.
  */
  const [disableMfaCode, setDisableMfaCode] = useState("");

  /*
  Referencia visual al formulario
  de desactivación MFA.
  */
  const disableMfaFormRef = useRef<HTMLDivElement | null>(null);

  /*
  Indica si el formulario de desactivación
  MFA se encuentra visible.
  */
  const [isDisableMfaFormVisible, setIsDisableMfaFormVisible] =
    useState(false);

  /*
  Permite mostrar temporalmente
  el secreto completo.

  El valor se presenta oculto inicialmente
  para evitar exposición accidental.
  */
  const [isSecretVisible, setIsSecretVisible] = useState(false);

  /*
  Feedback visual utilizado para informar
  qué contenido fue copiado.
  */
  const [copiedValue, setCopiedValue] = useState<
    "SECRET" | "RECOVERY_CODES" | null
  >(null);

  /*
  Evita acciones repetidas mientras
  existe una operación MFA en curso.
  */
  const isProcessing =
    isConfiguringMfa || isConfirmingMfa || isDisablingMfa;

  /*
  Estado MFA actual derivado exclusivamente
  de la sesión autenticada.
  */
  const isMfaEnabled = Boolean(user?.mfaHabilitado);

  /*
  Indica si el flujo actual posee
  una configuración temporal válida.
  */
  const hasPendingConfiguration =
    setupStep === "CONFIGURATION" && Boolean(mfaConfiguration);

  /*
  Limpia feedback de interfaz y backend
  antes de una nueva interacción.
  */
  const clearCurrentFeedback = () => {
    if (validationError) {
      setValidationError(null);
    }

    if (error || successMessage) {
      clearFeedback();
    }
  };

  /*
  Inicia una nueva configuración MFA.

  Backend genera:

  - secreto para la aplicación autenticadora;
  - códigos de recuperación de un solo uso.

  La operación todavía no habilita MFA.
  */
  const handleStartMfaConfiguration = async () => {
    clearCurrentFeedback();

    setVerificationCode("");
    setIsSecretVisible(false);
    setCopiedValue(null);

    const response = await handleConfigureMfa();

    if (!response) {
      return;
    }

    setMfaConfiguration(response);
    setSetupStep("CONFIGURATION");
  };

  /*
  Actualiza el código TOTP.

  La interfaz acepta únicamente números
  y limita el valor a seis dígitos.

  Backend conserva la validación definitiva.
  */
  const handleVerificationCodeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 6);

    setVerificationCode(numericValue);

    clearCurrentFeedback();
  };

  /*
  Confirma la activación MFA.

  Frontend valida únicamente:

  - presencia del código;
  - longitud exacta;
  - formato numérico.

  Backend valida el secreto pendiente,
  el código TOTP y la vigencia
  de la configuración.
  */
  const handleSubmitMfaConfirmation = async () => {
    clearCurrentFeedback();

    const normalizedCode = verificationCode.trim();

    if (!/^\d{6}$/.test(normalizedCode)) {
      setValidationError("Ingresá el código de 6 dígitos de tu aplicación.");

      verificationFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    const response = await handleConfirmMfa(normalizedCode);

    if (!response) {
      verificationFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    setVerificationCode("");
    setSetupStep("COMPLETED");
  };

  /*
  Muestra el formulario de desactivación
  MFA y limpia cualquier dato sensible
  previamente ingresado.
  */
  const handleOpenDisableMfaForm = () => {
    clearCurrentFeedback();

    setDisableMfaPassword("");
    setDisableMfaCode("");
    setIsDisableMfaFormVisible(true);

    window.setTimeout(() => {
      disableMfaFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  };

  /*
  Cancela visualmente la desactivación MFA.

  Los datos ingresados se eliminan
  inmediatamente del estado local.
  */
  const handleCancelDisableMfa = () => {
    if (isProcessing) {
      return;
    }

    clearCurrentFeedback();

    setDisableMfaPassword("");
    setDisableMfaCode("");
    setIsDisableMfaFormVisible(false);
  };

  /*
  Actualiza la contraseña actual
  utilizada para desactivar MFA.
  */
  const handleDisableMfaPasswordChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setDisableMfaPassword(event.target.value);

    clearCurrentFeedback();
  };

  /*
  Actualiza el código TOTP utilizado
  para desactivar MFA.

  La interfaz acepta únicamente números
  y limita el valor a seis dígitos.
  */
  const handleDisableMfaCodeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const numericValue = event.target.value.replace(/\D/g, "").slice(0, 6);

    setDisableMfaCode(numericValue);

    clearCurrentFeedback();
  };

  /*
  Confirma la desactivación MFA.

  Frontend valida únicamente:

  - presencia de contraseña actual;
  - presencia del código;
  - longitud exacta;
  - formato numérico.

  Backend conserva la validación definitiva
  de contraseña, código TOTP y permisos.
  */
  const handleSubmitDisableMfa = async () => {
    clearCurrentFeedback();

    const normalizedCode = disableMfaCode.trim();

    if (!disableMfaPassword) {
      setValidationError("Ingresá tu contraseña actual.");

      disableMfaFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    if (!/^\d{6}$/.test(normalizedCode)) {
      setValidationError("Ingresá el código de 6 dígitos de tu aplicación.");

      disableMfaFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    const response = await handleDisableMfa(disableMfaPassword, normalizedCode);

    if (!response) {
      disableMfaFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    setDisableMfaPassword("");
    setDisableMfaCode("");
    setIsDisableMfaFormVisible(false);
    setMfaConfiguration(null);
    setSetupStep("IDLE");
  };

  /*
  Copia contenido sensible mediante
  la Clipboard API del navegador.

  Si el navegador no permite la operación,
  se muestra feedback controlado.
  */
  const copyToClipboard = async (
    value: string,
    type: "SECRET" | "RECOVERY_CODES",
  ) => {
    clearCurrentFeedback();

    try {
      await navigator.clipboard.writeText(value);

      setCopiedValue(type);

      window.setTimeout(() => {
        setCopiedValue((currentValue) =>
          currentValue === type ? null : currentValue,
        );
      }, 2500);
    } catch {
      setValidationError(
        "No pudimos copiar el contenido. Seleccionalo y copialo manualmente.",
      );
    }
  };

  /*
  Copia todos los códigos manteniendo
  un formato simple de una línea por código.
  */
  const handleCopyRecoveryCodes = async () => {
    if (!mfaConfiguration) {
      return;
    }

    await copyToClipboard(
      mfaConfiguration.codigosRecuperacion.join("\n"),
      "RECOVERY_CODES",
    );
  };

  /*
  Permite abandonar visualmente
  una configuración todavía no confirmada.

  La información sensible se elimina
  inmediatamente de la memoria local
  del componente.

  Una nueva configuración reemplazará
  cualquier configuración pendiente
  en backend.
  */
  const handleCancelConfiguration = () => {
    if (isProcessing) {
      return;
    }

    clearFeedback();

    setMfaConfiguration(null);
    setSetupStep("IDLE");
    setVerificationCode("");
    setValidationError(null);
    setIsSecretVisible(false);
    setCopiedValue(null);
    setDisableMfaPassword("");
    setDisableMfaCode("");
    setIsDisableMfaFormVisible(false);
  };

  /*
  Mientras AuthProvider reconstruye
  la sesión no se muestran datos
  potencialmente incorrectos.
  */
  if (!isAuthReady) {
    return (
      <Box sx={settingsStyles.loadingState}>
        <CircularProgress size={30} />

        <Typography sx={settingsStyles.loadingText}>
          Cargando configuración...
        </Typography>
      </Box>
    );
  }

  /*
  Estado defensivo.

  Normalmente la protección corresponde
  a la Page o al layout administrativo.
  */
  if (!user) {
    return (
      <Box sx={settingsStyles.root}>
        <Alert severity="error">
          No pudimos identificar la sesión administrativa actual.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={settingsStyles.root}>
      <Box sx={settingsStyles.pageContent}>
        {/* ENCABEZADO */}
        <Box sx={settingsStyles.pageHeader}>
          <Box sx={settingsStyles.pageHeaderIcon}>
            <SecurityRoundedIcon />
          </Box>

          <Box sx={settingsStyles.pageHeaderContent}>
            <Typography component="h1" sx={settingsStyles.pageTitle}>
              Configuración
            </Typography>

            <Typography sx={settingsStyles.pageDescription}>
              Administrá la seguridad y las preferencias de tu cuenta.
            </Typography>
          </Box>
        </Box>

        {/* FEEDBACK GLOBAL */}

        {successMessage && (
          <Alert
            severity="success"
            onClose={clearFeedback}
            sx={settingsStyles.feedbackAlert}
          >
            {successMessage}
          </Alert>
        )}

        {error && !hasPendingConfiguration && !isDisableMfaFormVisible && (
          <Alert
            severity="error"
            onClose={clearFeedback}
            sx={settingsStyles.feedbackAlert}
          >
            {error}
          </Alert>
        )}

        {validationError && (
          <Alert
            severity="error"
            onClose={() => setValidationError(null)}
            sx={settingsStyles.feedbackAlert}
          >
            {validationError}
          </Alert>
        )}

        {/* RESUMEN DE SEGURIDAD */}
        <Box sx={settingsStyles.summaryGrid}>
          <Box sx={settingsStyles.summaryCard}>
            <Box sx={settingsStyles.summaryIcon}>
              <VerifiedUserRoundedIcon />
            </Box>

            <Box sx={settingsStyles.summaryContent}>
              <Typography sx={settingsStyles.summaryLabel}>
                Estado de la cuenta
              </Typography>

              <Typography sx={settingsStyles.summaryValue}>
                Protegida
              </Typography>

              <Typography sx={settingsStyles.summaryHint}>
                Sesión administrativa autenticada
              </Typography>
            </Box>
          </Box>

          <Box sx={settingsStyles.summaryCard}>
            <Box
              sx={{
                ...settingsStyles.summaryIcon,
                ...(isMfaEnabled
                  ? settingsStyles.summaryIconSuccess
                  : settingsStyles.summaryIconWarning),
              }}
            >
              <ShieldOutlinedIcon />
            </Box>

            <Box sx={settingsStyles.summaryContent}>
              <Typography sx={settingsStyles.summaryLabel}>
                Autenticación en dos pasos
              </Typography>

              <Typography sx={settingsStyles.summaryValue}>
                {isMfaEnabled ? "Activa" : "Inactiva"}
              </Typography>

              <Typography sx={settingsStyles.summaryHint}>
                {isMfaEnabled
                  ? "Segundo factor requerido al iniciar sesión"
                  : "Recomendamos activarla para proteger la cuenta"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* PANEL DE SEGURIDAD */}
        <Box sx={settingsStyles.panel}>
          <Box sx={settingsStyles.panelHeader}>
            <Box sx={settingsStyles.panelHeaderContent}>
              <Typography sx={settingsStyles.panelTitle}>
                Seguridad de la cuenta
              </Typography>

              <Typography sx={settingsStyles.panelSubtitle}>
                Configurá mecanismos adicionales para proteger el acceso
                administrativo.
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={settingsStyles.panelBody}>
            {/* INFORMACIÓN DE CUENTA */}
            <Box sx={settingsStyles.accountSection}>
              <Typography sx={settingsStyles.sectionTitle}>
                Cuenta administrativa
              </Typography>

              <Box sx={settingsStyles.accountCard}>
                <Box sx={settingsStyles.accountIcon}>
                  <LockOutlinedIcon />
                </Box>

                <Box sx={settingsStyles.accountInformation}>
                  <Typography sx={settingsStyles.accountEmail}>
                    {user.email}
                  </Typography>

                  <Typography sx={settingsStyles.accountMeta}>
                    Rol administrador · Estado {user.estado.toLowerCase()}
                  </Typography>
                </Box>

                <Chip
                  label={user.estado === "ACTIVO" ? "Activa" : user.estado}
                  size="small"
                  sx={settingsStyles.accountStatusChip}
                />
              </Box>
            </Box>

            <Divider sx={settingsStyles.sectionDivider} />

            {/* MFA */}
            <Box sx={settingsStyles.mfaSection}>
              <Box sx={settingsStyles.mfaHeader}>
                <Box sx={settingsStyles.mfaHeaderIdentity}>
                  <Box
                    sx={{
                      ...settingsStyles.mfaIcon,
                      ...(isMfaEnabled
                        ? settingsStyles.mfaIconEnabled
                        : settingsStyles.mfaIconDisabled),
                    }}
                  >
                    <SmartphoneRoundedIcon />
                  </Box>

                  <Box sx={settingsStyles.mfaHeaderContent}>
                    <Box sx={settingsStyles.mfaTitleRow}>
                      <Typography sx={settingsStyles.mfaTitle}>
                        Autenticación en dos pasos
                      </Typography>

                      <Chip
                        label={isMfaEnabled ? "Habilitada" : "Deshabilitada"}
                        size="small"
                        sx={{
                          ...settingsStyles.mfaStatusChip,
                          ...(isMfaEnabled
                            ? settingsStyles.mfaStatusEnabled
                            : settingsStyles.mfaStatusDisabled),
                        }}
                      />
                    </Box>

                    <Typography sx={settingsStyles.mfaDescription}>
                      Protegé tu cuenta mediante códigos temporales generados
                      por una aplicación autenticadora.
                    </Typography>
                  </Box>
                </Box>

                {!isMfaEnabled && setupStep === "IDLE" && (
                  <Button
                    variant="contained"
                    startIcon={<SecurityRoundedIcon />}
                    onClick={() => void handleStartMfaConfiguration()}
                    disabled={isProcessing}
                    sx={settingsStyles.primaryButton}
                  >
                    {isConfiguringMfa ? "Configurando..." : "Configurar MFA"}
                  </Button>
                )}
              </Box>

              {/* MFA YA HABILITADO */}
              {isMfaEnabled && setupStep !== "COMPLETED" && (
                <Box sx={settingsStyles.enabledNotice}>
                  <Box sx={settingsStyles.enabledNoticeIcon}>
                    <CheckCircleRoundedIcon />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={settingsStyles.enabledNoticeTitle}>
                      MFA está habilitado
                    </Typography>

                    <Typography sx={settingsStyles.enabledNoticeDescription}>
                      Cada nuevo inicio de sesión administrativo requiere un
                      código de seis dígitos de tu aplicación autenticadora.
                    </Typography>

                    {!isDisableMfaFormVisible && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<WarningAmberRoundedIcon />}
                          onClick={handleOpenDisableMfaForm}
                          disabled={isProcessing}
                          sx={settingsStyles.secondaryButton}
                        >
                          Desactivar MFA
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* DESACTIVACIÓN MFA */}
              {isMfaEnabled &&
                isDisableMfaFormVisible &&
                setupStep !== "COMPLETED" && (
                  <Box
                    ref={disableMfaFormRef}
                    sx={{
                      ...settingsStyles.setupContainer,
                      mt: 2,
                    }}
                  >
                    <Box sx={settingsStyles.setupIntroduction}>
                      <Typography sx={settingsStyles.setupTitle}>
                        Desactivar MFA
                      </Typography>

                      <Typography sx={settingsStyles.setupDescription}>
                        Para proteger la cuenta, confirmá tu contraseña actual
                        y el código vigente de tu aplicación autenticadora.
                      </Typography>
                    </Box>

                    <Alert
                      severity="warning"
                      icon={<WarningAmberRoundedIcon />}
                      sx={settingsStyles.recoveryWarning}
                    >
                      Al desactivar MFA se eliminarán los códigos de
                      recuperación actuales y la cuenta dejará de solicitar
                      segundo factor en nuevos inicios de sesión.
                    </Alert>

                    <Box sx={settingsStyles.verificationForm}>
                      <TextField
                        label="Contraseña actual"
                        type="password"
                        value={disableMfaPassword}
                        onChange={handleDisableMfaPasswordChange}
                        autoComplete="current-password"
                        disabled={isProcessing}
                        error={Boolean(validationError)}
                        fullWidth
                        sx={{
                          ...settingsStyles.codeField,
                          mb: 2,
                        }}
                        slotProps={{
                          htmlInput: {
                            "aria-label":
                              "Contraseña actual para desactivar MFA",
                          },
                          input: {
                            startAdornment: (
                              <LockOutlinedIcon
                                sx={settingsStyles.codeFieldIcon}
                              />
                            ),
                          },
                        }}
                      />

                      <TextField
                        label="Código de verificación"
                        value={disableMfaCode}
                        onChange={handleDisableMfaCodeChange}
                        placeholder="000000"
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        disabled={isProcessing}
                        error={Boolean(validationError)}
                        fullWidth
                        sx={settingsStyles.codeField}
                        slotProps={{
                          htmlInput: {
                            maxLength: 6,
                            "aria-label":
                              "Código MFA de seis dígitos para desactivar MFA",
                          },
                          input: {
                            startAdornment: (
                              <KeyRoundedIcon
                                sx={settingsStyles.codeFieldIcon}
                              />
                            ),
                          },
                        }}
                      />

                      {error && (
                        <Alert
                          severity="error"
                          onClose={clearFeedback}
                          sx={{ mt: 2 }}
                        >
                          {error}
                        </Alert>
                      )}

                      <Box sx={settingsStyles.verificationActions}>
                        <Button
                          variant="outlined"
                          onClick={handleCancelDisableMfa}
                          disabled={isProcessing}
                          sx={settingsStyles.secondaryButton}
                        >
                          Cancelar
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          startIcon={
                            isDisablingMfa ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <WarningAmberRoundedIcon />
                            )
                          }
                          onClick={() => void handleSubmitDisableMfa()}
                          disabled={
                            isProcessing ||
                            !disableMfaPassword ||
                            disableMfaCode.length !== 6
                          }
                          sx={settingsStyles.primaryButton}
                        >
                          {isDisablingMfa
                            ? "Desactivando..."
                            : "Desactivar MFA"}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}

              {/* CONFIGURACIÓN EN PROCESO */}
              {hasPendingConfiguration && mfaConfiguration && (
                <Box sx={settingsStyles.setupContainer}>
                  <Box sx={settingsStyles.setupIntroduction}>
                    <Typography sx={settingsStyles.setupTitle}>
                      Completá la configuración
                    </Typography>

                    <Typography sx={settingsStyles.setupDescription}>
                      Seguí los pasos en orden. MFA no quedará habilitado hasta
                      que confirmes un código válido.
                    </Typography>
                  </Box>

                  {/* PASO 1 */}
                  <Box sx={settingsStyles.setupStep}>
                    <Box sx={settingsStyles.stepNumber}>1</Box>

                    <Box sx={settingsStyles.stepContent}>
                      <Typography sx={settingsStyles.stepTitle}>
                        Agregá la cuenta a tu aplicación
                      </Typography>

                      <Typography sx={settingsStyles.stepDescription}>
                        Abrí Google Authenticator, Microsoft Authenticator,
                        Authy u otra aplicación compatible y agregá una cuenta
                        mediante clave manual.
                      </Typography>

                      <Box sx={settingsStyles.secretCard}>
                        <Box sx={settingsStyles.secretInformation}>
                          <Typography sx={settingsStyles.secretLabel}>
                            Clave de configuración
                          </Typography>

                          <Typography
                            component="code"
                            sx={settingsStyles.secretValue}
                          >
                            {isSecretVisible
                              ? mfaConfiguration.secreto
                              : maskSecret(mfaConfiguration.secreto)}
                          </Typography>
                        </Box>

                        <Box sx={settingsStyles.secretActions}>
                          <Button
                            variant="text"
                            onClick={() =>
                              setIsSecretVisible((current) => !current)
                            }
                            sx={settingsStyles.textButton}
                          >
                            {isSecretVisible ? "Ocultar" : "Mostrar"}
                          </Button>

                          <Tooltip
                            title={
                              copiedValue === "SECRET"
                                ? "Clave copiada"
                                : "Copiar clave"
                            }
                          >
                            <IconButton
                              aria-label="Copiar clave de configuración MFA"
                              onClick={() =>
                                void copyToClipboard(
                                  mfaConfiguration.secreto,
                                  "SECRET",
                                )
                              }
                              sx={settingsStyles.copyButton}
                            >
                              {copiedValue === "SECRET" ? (
                                <CheckCircleRoundedIcon />
                              ) : (
                                <ContentCopyRoundedIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={settingsStyles.setupDivider} />

                  {/* PASO 2 */}
                  <Box sx={settingsStyles.setupStep}>
                    <Box sx={settingsStyles.stepNumber}>2</Box>

                    <Box sx={settingsStyles.stepContent}>
                      <Typography sx={settingsStyles.stepTitle}>
                        Guardá los códigos de recuperación
                      </Typography>

                      <Typography sx={settingsStyles.stepDescription}>
                        Cada código puede utilizarse una sola vez para ingresar
                        cuando no tengas acceso a tu aplicación autenticadora.
                      </Typography>

                      <Alert
                        severity="warning"
                        icon={<WarningAmberRoundedIcon />}
                        sx={settingsStyles.recoveryWarning}
                      >
                        Guardalos ahora en un lugar seguro. No se volverán a
                        mostrar después de abandonar esta configuración.
                      </Alert>

                      <Box sx={settingsStyles.recoveryCard}>
                        <Box sx={settingsStyles.recoveryHeader}>
                          <Box>
                            <Typography sx={settingsStyles.recoveryTitle}>
                              Códigos de recuperación
                            </Typography>

                            <Typography sx={settingsStyles.recoverySubtitle}>
                              {mfaConfiguration.codigosRecuperacion.length}{" "}
                              códigos de un solo uso
                            </Typography>
                          </Box>

                          <Button
                            variant="outlined"
                            startIcon={
                              copiedValue === "RECOVERY_CODES" ? (
                                <CheckCircleRoundedIcon />
                              ) : (
                                <ContentCopyRoundedIcon />
                              )
                            }
                            onClick={() => void handleCopyRecoveryCodes()}
                            sx={settingsStyles.copyCodesButton}
                          >
                            {copiedValue === "RECOVERY_CODES"
                              ? "Copiados"
                              : "Copiar todos"}
                          </Button>
                        </Box>

                        <Box sx={settingsStyles.recoveryCodesGrid}>
                          {mfaConfiguration.codigosRecuperacion.map(
                            (recoveryCode, index) => (
                              <Box
                                key={`${recoveryCode}-${index}`}
                                component="code"
                                sx={settingsStyles.recoveryCode}
                              >
                                {recoveryCode}
                              </Box>
                            ),
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={settingsStyles.setupDivider} />

                  {/* PASO 3 */}
                  <Box sx={settingsStyles.setupStep}>
                    <Box sx={settingsStyles.stepNumber}>3</Box>

                    <Box sx={settingsStyles.stepContent}>
                      <Typography sx={settingsStyles.stepTitle}>
                        Confirmá el código
                      </Typography>

                      <Typography sx={settingsStyles.stepDescription}>
                        Ingresá el código actual de seis dígitos generado por tu
                        aplicación.
                      </Typography>

                      <Box
                        ref={verificationFormRef}
                        sx={settingsStyles.verificationForm}
                      >
                        <TextField
                          label="Código de verificación"
                          value={verificationCode}
                          onChange={handleVerificationCodeChange}
                          placeholder="000000"
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          disabled={isProcessing}
                          error={Boolean(validationError)}
                          fullWidth
                          sx={settingsStyles.codeField}
                          slotProps={{
                            htmlInput: {
                              maxLength: 6,
                              "aria-label":
                                "Código de verificación de seis dígitos",
                            },
                            input: {
                              startAdornment: (
                                <KeyRoundedIcon
                                  sx={settingsStyles.codeFieldIcon}
                                />
                              ),
                            },
                          }}
                        />

                        {error && (
                          <Alert
                            severity="error"
                            onClose={clearFeedback}
                            sx={{ mb: 2 }}
                          >
                            {error}
                          </Alert>
                        )}

                        <Box sx={settingsStyles.verificationActions}>
                          <Button
                            variant="outlined"
                            onClick={handleCancelConfiguration}
                            disabled={isProcessing}
                            sx={settingsStyles.secondaryButton}
                          >
                            Cancelar
                          </Button>

                          <Button
                            variant="contained"
                            startIcon={
                              isConfirmingMfa ? (
                                <CircularProgress size={18} color="inherit" />
                              ) : (
                                <VerifiedUserRoundedIcon />
                              )
                            }
                            onClick={() => void handleSubmitMfaConfirmation()}
                            disabled={
                              isProcessing || verificationCode.length !== 6
                            }
                            sx={settingsStyles.primaryButton}
                          >
                            {isConfirmingMfa ? "Confirmando..." : "Activar MFA"}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* CONFIGURACIÓN FINALIZADA */}
              {setupStep === "COMPLETED" && (
                <Box sx={settingsStyles.completedState}>
                  <Box sx={settingsStyles.completedIcon}>
                    <CheckCircleRoundedIcon />
                  </Box>

                  <Box sx={settingsStyles.completedContent}>
                    <Typography sx={settingsStyles.completedTitle}>
                      MFA quedó habilitado correctamente
                    </Typography>

                    <Typography sx={settingsStyles.completedDescription}>
                      Tu cuenta administrativa ahora solicitará un segundo
                      factor en los próximos inicios de sesión.
                    </Typography>

                    {mfaConfiguration && (
                      <Typography sx={settingsStyles.completedReminder}>
                        Confirmá que guardaste los códigos de recuperación antes
                        de abandonar esta pantalla.
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}