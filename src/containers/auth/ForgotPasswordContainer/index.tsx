"use client";

import { useState } from "react";
import Link from "next/link";

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
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import { useAuthentication } from "@/hooks/auth/useAuthentication";

import { forgotPasswordStyles } from "./forgotPassword.styles";

/*
==================================================
CONTAINER DE RECUPERACIÓN DE CONTRASEÑA
==================================================
*/

/*
Container correspondiente al flujo de
recuperación de contraseña.

Responsabilidades:

- renderizar la interfaz del formulario;

- administrar el estado local del correo;

- solicitar la recuperación mediante
  useAuthentication;

- mostrar mensajes de éxito y error.

Este container NO realiza llamadas
directas al backend.

Este container NO contiene reglas
de negocio.

Toda la comunicación con el backend
ocurre mediante useAuthentication.
*/
export default function ForgotPasswordContainer() {
  /*
  Estado local del correo electrónico.
  */
  const [email, setEmail] = useState("");

  /*
  Obtiene el flujo correspondiente
  a la recuperación de contraseña.
  */
  const {
    handleRequestPasswordRecovery,
    isRequestingPasswordRecovery,
    error,
    successMessage,
    clearFeedback,
  } = useAuthentication();

  /*
  Actualiza el correo electrónico.

  También elimina mensajes anteriores
  cuando el usuario modifica el campo.
  */
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);

    if (error || successMessage) {
      clearFeedback();
    }
  };

  /*
  Envía la solicitud de recuperación
  al backend.
  */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await handleRequestPasswordRecovery(email);
  };

  return (
    <Box component="main" sx={forgotPasswordStyles.page}>
      <Container maxWidth={false} sx={forgotPasswordStyles.container}>
        <Stack spacing={1.2} sx={forgotPasswordStyles.brandWrapper}>
          <Box sx={forgotPasswordStyles.brandIcon}>G</Box>

          <Box>
            <Typography
              component="h1"
              variant="h4"
              sx={forgotPasswordStyles.brandTitle}
            >
              Green Acres
            </Typography>

            <Typography variant="body2" sx={forgotPasswordStyles.brandSubtitle}>
              Gestión inteligente para clubes
            </Typography>
          </Box>
        </Stack>

        <Paper elevation={0} sx={forgotPasswordStyles.card}>
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <Box>
              <Typography
                component="h2"
                variant="h5"
                sx={forgotPasswordStyles.cardTitle}
              >
                Recuperar contraseña
              </Typography>

              <Typography
                variant="body2"
                sx={forgotPasswordStyles.cardSubtitle}
              >
                Ingresá tu correo electrónico para recibir las instrucciones de
                recuperación.
              </Typography>
            </Box>

            <Stack spacing={0.8}>
              <Typography
                component="label"
                htmlFor="recovery-email"
                variant="body2"
                sx={forgotPasswordStyles.fieldLabel}
              >
                Correo electrónico
              </Typography>

              <TextField
                id="recovery-email"
                type="email"
                fullWidth
                autoComplete="email"
                placeholder="Ingresá tu correo electrónico"
                value={email}
                onChange={handleEmailChange}
                disabled={isRequestingPasswordRecovery}
                sx={forgotPasswordStyles.input}
              />
            </Stack>

            {error && (
              <Alert severity="error" sx={forgotPasswordStyles.errorAlert}>
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={forgotPasswordStyles.successAlert}>
                {successMessage}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isRequestingPasswordRecovery}
              sx={forgotPasswordStyles.submitButton}
            >
              {isRequestingPasswordRecovery
                ? "Enviando..."
                : "Enviar instrucciones"}
            </Button>

            <Button
              component={Link}
              href="/"
              variant="text"
              startIcon={<ArrowBackRoundedIcon />}
              sx={forgotPasswordStyles.backToLoginLink}
            >
              Volver al inicio de sesión
            </Button>

            <Box sx={forgotPasswordStyles.securityNotice}>
              <Typography
                variant="subtitle2"
                sx={forgotPasswordStyles.securityNoticeTitle}
              >
                Aviso de seguridad
              </Typography>

              <Typography
                variant="body2"
                sx={forgotPasswordStyles.securityNoticeDescription}
              >
                Por motivos de seguridad, el sistema siempre mostrará la misma
                respuesta, independientemente de que el correo electrónico
                exista o no dentro del sistema.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
