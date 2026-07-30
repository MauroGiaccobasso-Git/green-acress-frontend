"use client";

import { useState } from "react";
import Link from "next/link";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useAuthentication } from "@/hooks/auth/useAuthentication";

import { resetPasswordStyles } from "./resetPassword.styles";

/*
==================================================
TIPOS
==================================================
*/

/*
Propiedades requeridas por el container.

El token se obtiene desde la ruta
y se entrega al container para evitar
que este componente conozca detalles
de navegación o construcción de URLs.
*/
type ResetPasswordContainerProps = {
  token: string | null;
};

/*
==================================================
CONTAINER DE RESTABLECIMIENTO DE CONTRASEÑA
==================================================
*/

/*
Container correspondiente al flujo de
restablecimiento de contraseña.

Responsabilidades:

- renderizar el formulario;
- administrar los campos de contraseña;
- validar coincidencia y longitud mínima;
- delegar el restablecimiento al hook;
- mostrar feedback de éxito o error;
- detectar la ausencia del token.

Este container NO realiza llamadas
directas al backend.

Este container NO valida la vigencia
ni el uso previo del token.

Esas reglas pertenecen al backend.

Toda la comunicación ocurre mediante
useAuthentication.
*/
export default function ResetPasswordContainer({
  token,
}: ResetPasswordContainerProps) {
  /*
  Campos locales del formulario.
  */
  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  /*
  Error correspondiente exclusivamente
  a validaciones visuales del formulario.

  No reemplaza los errores devueltos
  por el backend.
  */
  const [validationError, setValidationError] = useState<string | null>(null);

  /*
  Consume el flujo funcional desde
  el hook principal de autenticación.
  */
  const {
    handleResetPassword,
    isResettingPassword,
    error,
    successMessage,
    clearFeedback,
  } = useAuthentication();

  /*
  Indica si la URL contiene un token
  utilizable por el formulario.

  La validez real del token será
  determinada exclusivamente por backend.
  */
  const hasToken = Boolean(token?.trim());

  /*
  Limpia el feedback anterior cuando
  el usuario vuelve a modificar
  alguno de los campos.
  */
  const clearFormFeedback = () => {
    if (validationError) {
      setValidationError(null);
    }

    if (error || successMessage) {
      clearFeedback();
    }
  };

  /*
  Actualiza la nueva contraseña.
  */
  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewPassword(event.target.value);

    clearFormFeedback();
  };

  /*
  Actualiza la confirmación
  de contraseña.
  */
  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(event.target.value);

    clearFormFeedback();
  };

  /*
  Valida el formulario y solicita
  el restablecimiento al backend.

  Las únicas validaciones realizadas
  en frontend son:

  - longitud mínima;
  - coincidencia entre campos.

  Backend vuelve a validar toda
  la política de seguridad.
  */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValidationError(null);

    if (!token?.trim()) {
      return;
    }

    if (newPassword.length < 8) {
      setValidationError(
        "La nueva contraseña debe contener al menos 8 caracteres.",
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Las contraseñas ingresadas no coinciden.");

      return;
    }

    const response = await handleResetPassword(token, newPassword);

    if (!response) {
      return;
    }

    /*
    Se limpian los campos luego
    de completar correctamente
    el restablecimiento.
    */
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Box component="main" sx={resetPasswordStyles.page}>
      <Container maxWidth={false} sx={resetPasswordStyles.container}>
        <Stack spacing={1.2} sx={resetPasswordStyles.brandWrapper}>
          <Box sx={resetPasswordStyles.brandIcon}>G</Box>

          <Box>
            <Typography
              component="h1"
              variant="h4"
              sx={resetPasswordStyles.brandTitle}
            >
              Green Acres
            </Typography>

            <Typography variant="body2" sx={resetPasswordStyles.brandSubtitle}>
              Gestión inteligente para clubes
            </Typography>
          </Box>
        </Stack>

        <Paper elevation={0} sx={resetPasswordStyles.card}>
          <Stack spacing={2}>
            <Box>
              <Typography
                component="h2"
                variant="h5"
                sx={resetPasswordStyles.cardTitle}
              >
                Restablecer contraseña
              </Typography>

              <Typography variant="body2" sx={resetPasswordStyles.cardSubtitle}>
                Creá una nueva contraseña para recuperar el acceso a tu cuenta.
              </Typography>
            </Box>

            {!hasToken ? (
              <>
                <Box sx={resetPasswordStyles.invalidTokenNotice}>
                  <Typography
                    variant="subtitle2"
                    sx={resetPasswordStyles.invalidTokenTitle}
                  >
                    Enlace inválido
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={resetPasswordStyles.invalidTokenDescription}
                  >
                    El enlace no contiene un token de recuperación. Solicitá uno
                    nuevo para continuar.
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  href="/forgotPassword"
                  variant="contained"
                  fullWidth
                  sx={resetPasswordStyles.submitButton}
                >
                  Solicitar un nuevo enlace
                </Button>

                <Button
                  component={Link}
                  href="/"
                  variant="text"
                  startIcon={<ArrowBackRoundedIcon />}
                  sx={resetPasswordStyles.backToLoginLink}
                >
                  Volver al inicio de sesión
                </Button>
              </>
            ) : successMessage ? (
              <>
                <Alert severity="success" sx={resetPasswordStyles.successAlert}>
                  {successMessage}
                </Alert>

                <Button
                  component={Link}
                  href="/"
                  variant="contained"
                  fullWidth
                  sx={resetPasswordStyles.submitButton}
                >
                  Ir al inicio de sesión
                </Button>
              </>
            ) : (
              <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                <Stack spacing={0.8}>
                  <Typography
                    component="label"
                    htmlFor="reset-password"
                    variant="body2"
                    sx={resetPasswordStyles.fieldLabel}
                  >
                    Nueva contraseña
                  </Typography>

                  <TextField
                    id="reset-password"
                    name="newPassword"
                    type="password"
                    fullWidth
                    required
                    autoComplete="new-password"
                    placeholder="Ingresá tu nueva contraseña"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    disabled={isResettingPassword}
                    sx={resetPasswordStyles.input}
                  />

                  <Typography
                    variant="body2"
                    sx={resetPasswordStyles.passwordHint}
                  >
                    Debe contener al menos 8 caracteres.
                  </Typography>
                </Stack>

                <Stack spacing={0.8}>
                  <Typography
                    component="label"
                    htmlFor="reset-password-confirmation"
                    variant="body2"
                    sx={resetPasswordStyles.fieldLabel}
                  >
                    Confirmar contraseña
                  </Typography>

                  <TextField
                    id="reset-password-confirmation"
                    name="confirmPassword"
                    type="password"
                    fullWidth
                    required
                    autoComplete="new-password"
                    placeholder="Repetí tu nueva contraseña"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    disabled={isResettingPassword}
                    sx={resetPasswordStyles.input}
                  />
                </Stack>

                {validationError && (
                  <Alert severity="error" sx={resetPasswordStyles.errorAlert}>
                    {validationError}
                  </Alert>
                )}

                {error && (
                  <Alert severity="error" sx={resetPasswordStyles.errorAlert}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isResettingPassword}
                  sx={resetPasswordStyles.submitButton}
                >
                  {isResettingPassword
                    ? "Restableciendo..."
                    : "Restablecer contraseña"}
                </Button>

                <Button
                  component={Link}
                  href="/"
                  variant="text"
                  startIcon={<ArrowBackRoundedIcon />}
                  sx={resetPasswordStyles.backToLoginLink}
                >
                  Volver al inicio de sesión
                </Button>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
