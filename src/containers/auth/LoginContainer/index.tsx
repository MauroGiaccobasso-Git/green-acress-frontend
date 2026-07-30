"use client";

import { useEffect, useState } from "react";
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

import { isMfaRequiredResponse } from "@/api/authApi";

import { getAuthenticatedRedirectPath } from "@/features/auth/utils/authRedirect";

import { useAuth } from "@/hooks/auth/useAuth";
import { useAuthentication } from "@/hooks/auth/useAuthentication";
import { saveMfaChallenge } from "@/features/auth/utils/mfaChallengeStorage";
import { loginStyles } from "./login.styles";

/*
==================================================
CONTAINER DE LOGIN
==================================================
*/

/*
Container de la pantalla de login.

Responsabilidades:

- renderizar interfaz de autenticación

- administrar campos del formulario

- ejecutar flujo de login mediante useAuthentication

- detectar si el backend requiere MFA

- detectar cambio obligatorio de contraseña

- redirigir usuarios autenticados según rol

Este container NO realiza llamadas
directas al backend.

Este container NO guarda sesiones
directamente.

Este container NO contiene lógica
interna de autenticación.
*/
export default function LoginContainer() {
  /*
  Estado local de los campos
  del formulario de autenticación.
  */
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  /*
  Router utilizado para redirigir
  luego del login o cuando ya existe
  una sesión autenticada.
  */
  const router = useRouter();

  /*
  Obtiene la sesión actual desde
  el contexto global de autenticación.

  isAuthReady permite esperar hasta que
  AuthProvider termine de restaurar
  la sesión persistida.
  */
  const { user, token, isAuthReady } = useAuth();

  /*
  Hook encargado del flujo real
  de autenticación contra backend.

  El container únicamente consume
  su resultado y decide cómo continuar
  el flujo visual.
  */
  const { handleLogin, isLoading, error, clearFeedback } = useAuthentication();

  /*
  Si ya existe una sesión activa,
  evita mostrar nuevamente el login
  y redirige según el rol del usuario.

  No toma ninguna decisión hasta que
  AuthProvider haya terminado de restaurar
  la sesión persistida.
  */
  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (!user || !token) {
      return;
    }

    if (user.rol === "SOCIO" && user.requiereConsentimiento) {
      router.replace("/consentimiento");

      return;
    }

    const redirectPath = getAuthenticatedRedirectPath(user.rol);

    router.replace(redirectPath);
  }, [isAuthReady, user, token, router]);

  /*
  Actualiza el campo email.

  También limpia cualquier error anterior
  para evitar mantener mensajes viejos
  mientras el usuario corrige los datos.
  */
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);

    if (error) {
      clearFeedback();
    }
  };

  /*
  Actualiza el campo contraseña.

  También limpia cualquier error anterior
  cuando el usuario modifica nuevamente
  sus credenciales.
  */
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);

    if (error) {
      clearFeedback();
    }
  };

  /*
  Maneja el envío del formulario
  y delega la autenticación real
  al hook useAuthentication.
  */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await handleLogin(email, password);

    /*
Si backend solicita cambio obligatorio
de contraseña temporal:

- todavía no existe una sesión completa;
- el usuario debe completar el primer acceso;
- se deriva al flujo correspondiente.

El código funcional permite tomar
la decisión sin depender del estado
asíncrono de React.
*/
    if (
      response &&
      "code" in response &&
      response.code === "AUTH_PASSWORD_CHANGE_REQUIRED"
    ) {
      router.push("/changePassword");

      return;
    }

    /*
Cuando ocurre un error diferente,
useAuthentication devuelve null
y expone el mensaje correspondiente.
*/
    if (!response) {
      return;
    }

    /*
    Si backend requiere MFA,
    las credenciales ya fueron
    validadas correctamente.

    Sin embargo, todavía no existe
    una sesión autenticada definitiva.

    Se guarda el desafío temporal
    en sessionStorage y se deriva
    al segundo paso del proceso
    de autenticación.
    */
    if (
      response &&
      "requiereMfa" in response &&
      isMfaRequiredResponse(response)
    ) {
      saveMfaChallenge({
        mfaChallengeToken: response.mfaChallengeToken,
        email: response.usuario.email,
      });

      router.push("/verifyMfa");

      return;
    }
    /*
En este punto solamente puede existir
un login exitoso.

Se valida explícitamente que exista
usuario antes de continuar.

Esto evita que TypeScript permita
casos funcionales incompletos.
*/
    if (!("usuario" in response)) {
      return;
    }

    /*
En este punto el login fue completado
y useAuthentication ya guardó la sesión
mediante AuthProvider.

Se redirige según el rol autenticado.
*/
    if (response.usuario.rol === "SOCIO" && response.requiereConsentimiento) {
      router.push("/consentimiento");

      return;
    }

    const redirectPath = getAuthenticatedRedirectPath(response.usuario.rol);

    router.push(redirectPath);
  };
  return (
    <Box component="main" sx={loginStyles.page}>
      <Container maxWidth={false} sx={loginStyles.container}>
        <Stack spacing={1.2} sx={loginStyles.brandWrapper}>
          <Box sx={loginStyles.brandIcon}>G</Box>

          <Box>
            <Typography component="h1" variant="h4" sx={loginStyles.brandTitle}>
              Green Acres
            </Typography>

            <Typography variant="body2" sx={loginStyles.brandSubtitle}>
              Gestión inteligente para clubes
            </Typography>
          </Box>
        </Stack>

        <Paper elevation={0} sx={loginStyles.card}>
          <Stack component="form" spacing={2} onSubmit={handleSubmit}>
            <Box>
              <Typography
                component="h2"
                variant="h5"
                sx={loginStyles.cardTitle}
              >
                Inicio de sesión
              </Typography>

              <Typography variant="body2" sx={loginStyles.cardSubtitle}>
                Accedé con tus credenciales para continuar.
              </Typography>
            </Box>

            <Stack spacing={0.8}>
              <Typography
                component="label"
                htmlFor="login-email"
                variant="body2"
                sx={loginStyles.fieldLabel}
              >
                Correo electrónico
              </Typography>

              <TextField
                id="login-email"
                placeholder="Ingresá tu correo electrónico"
                name="email"
                type="email"
                fullWidth
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                sx={loginStyles.input}
              />
            </Stack>

            <Stack spacing={0.8}>
              <Typography
                component="label"
                htmlFor="login-password"
                variant="body2"
                sx={loginStyles.fieldLabel}
              >
                Contraseña
              </Typography>

              <TextField
                id="login-password"
                placeholder="Ingresá tu contraseña"
                name="password"
                type="password"
                fullWidth
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
                sx={loginStyles.input}
              />
            </Stack>

            {error && (
              <Alert severity="error" sx={loginStyles.errorAlert}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={loginStyles.submitButton}
            >
              {isLoading ? "Ingresando..." : "Iniciar sesión"}
            </Button>

            <Link
              href="/forgotPassword"
              underline="none"
              sx={loginStyles.forgotPasswordLink}
            >
              ¿Olvidaste tu contraseña?
            </Link>

            <Box sx={loginStyles.twoFactorBox}>
              <Typography variant="subtitle2" sx={loginStyles.twoFactorTitle}>
                Verificación en dos pasos
              </Typography>

              <Typography variant="body2" sx={loginStyles.twoFactorDescription}>
                Luego de validar tus credenciales, el sistema solicitará un
                código de verificación de 6 dígitos.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
