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
import { useRouter } from "next/navigation";

import { changePasswordStyles } from "./changePassword.styles";

/*
==================================================
CONTAINER DE CAMBIO DE CONTRASEÑA TEMPORAL
==================================================
*/

/*
Container correspondiente al flujo de
cambio obligatorio de contraseña temporal.

Responsabilidades:

- renderizar la interfaz del formulario;

- administrar el estado local de los campos;

- validar reglas visuales del formulario;

- ejecutar el cambio mediante
  useAuthentication;

- mostrar mensajes de éxito y error.

Este container NO realiza llamadas
directas al backend.

Este container NO contiene reglas
de negocio.

Toda la comunicación con backend
ocurre mediante useAuthentication.
*/
export default function ChangePasswordContainer() {
  /*
  Router utilizado para redirigir
  luego de completar correctamente
  el cambio obligatorio de contraseña.
  */
  const router = useRouter();

  /*
  Estado local del correo electrónico.
  */
  const [email, setEmail] = useState("");

  /*
  Estado local de la contraseña temporal.
  */
  const [currentPassword, setCurrentPassword] = useState("");

  /*
  Estado local de la nueva contraseña.
  */
  const [newPassword, setNewPassword] = useState("");

  /*
  Estado local de confirmación
  de nueva contraseña.
  */
  const [confirmPassword, setConfirmPassword] = useState("");

  /*
  Error generado por validaciones
  propias del formulario.
  */
  const [validationError, setValidationError] = useState<string | null>(null);

  /*
  Obtiene el flujo correspondiente
  al cambio de contraseña temporal.
  */
  const {
    handleChangeTemporaryPassword,
    isChangingTemporaryPassword,
    error,
    successMessage,
    clearFeedback,
  } = useAuthentication();

  /*
  Limpia mensajes anteriores
  cuando el usuario modifica
  cualquier campo.
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
  Envía la solicitud de cambio
  de contraseña temporal.
  */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValidationError(null);

    /*
    Validación visual mínima.

    La política definitiva pertenece
    al backend.
    */
    if (newPassword.length < 8) {
      setValidationError(
        "La nueva contraseña debe contener al menos 8 caracteres.",
      );

      return;
    }

    /*
    Validación visual de confirmación.
    */
    if (newPassword !== confirmPassword) {
      setValidationError("Las contraseñas ingresadas no coinciden.");

      return;
    }

    const success = await handleChangeTemporaryPassword(
      email,
      currentPassword,
      newPassword,
    );

    if (success) {
      router.push("/");
    }
  };

  return (
    <Box component="main" sx={changePasswordStyles.page}>
      <Container maxWidth={false} sx={changePasswordStyles.container}>
        <Stack spacing={1.2} sx={changePasswordStyles.brandWrapper}>
          <Box sx={changePasswordStyles.brandIcon}>G</Box>

          <Box>
            <Typography
              component="h1"
              variant="h4"
              sx={changePasswordStyles.brandTitle}
            >
              Green Acres
            </Typography>

            <Typography variant="body2" sx={changePasswordStyles.brandSubtitle}>
              Gestión inteligente para clubes
            </Typography>
          </Box>
        </Stack>

        <Paper elevation={0} sx={changePasswordStyles.card}>
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <Box>
              <Typography
                component="h2"
                variant="h5"
                sx={changePasswordStyles.cardTitle}
              >
                Cambiar contraseña
              </Typography>

              <Typography
                variant="body2"
                sx={changePasswordStyles.cardSubtitle}
              >
                Por seguridad debés reemplazar tu contraseña temporal antes de
                continuar.
              </Typography>
            </Box>

            <Box sx={changePasswordStyles.temporaryPasswordNotice}>
              <Typography
                variant="subtitle2"
                sx={changePasswordStyles.temporaryPasswordTitle}
              >
                Primer acceso requerido
              </Typography>

              <Typography
                variant="body2"
                sx={changePasswordStyles.temporaryPasswordDescription}
              >
                La contraseña temporal enviada por el sistema debe ser
                reemplazada por una contraseña personal.
              </Typography>
            </Box>

            <TextField
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFormFeedback();
              }}
              disabled={isChangingTemporaryPassword}
              sx={changePasswordStyles.input}
            />

            <TextField
              label="Contraseña temporal"
              type="password"
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value);
                clearFormFeedback();
              }}
              disabled={isChangingTemporaryPassword}
              sx={changePasswordStyles.input}
            />

            <TextField
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                clearFormFeedback();
              }}
              disabled={isChangingTemporaryPassword}
              sx={changePasswordStyles.input}
            />

            <Typography variant="body2" sx={changePasswordStyles.passwordHint}>
              Debe contener al menos 8 caracteres.
            </Typography>

            <TextField
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                clearFormFeedback();
              }}
              disabled={isChangingTemporaryPassword}
              sx={changePasswordStyles.input}
            />

            {validationError && (
              <Alert severity="error" sx={changePasswordStyles.errorAlert}>
                {validationError}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={changePasswordStyles.errorAlert}>
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={changePasswordStyles.successAlert}>
                {successMessage}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isChangingTemporaryPassword}
              sx={changePasswordStyles.submitButton}
            >
              {isChangingTemporaryPassword
                ? "Cambiando..."
                : "Cambiar contraseña"}
            </Button>

            <Button
              component={Link}
              href="/"
              variant="text"
              startIcon={<ArrowBackRoundedIcon />}
              sx={changePasswordStyles.backToLoginLink}
            >
              Volver al inicio de sesión
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
