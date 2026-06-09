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

import { useAuth } from "@/hooks/auth/useAuth";
import { useLogin } from "@/hooks/auth/useLogin";
import { getAuthenticatedRedirectPath } from "@/features/auth/utils/authRedirect";

import { loginStyles } from "./login.styles";

/*
Container de la pantalla de login.

Responsabilidades:
- renderizar interfaz de autenticación;
- administrar campos del formulario;
- ejecutar flujo de login mediante useLogin;
- redirigir usuario autenticado según rol.

NO realiza llamadas directas al backend.
NO contiene lógica interna de autenticación.
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
  luego del login o si ya existe sesión.
  */
  const router = useRouter();

  /*
  Obtiene la sesión actual desde
  el contexto global de autenticación.
  */
  const { user, token } = useAuth();

  /*
  Hook encargado del flujo real
  de autenticación contra backend.
  */
  const { handleLogin, isLoading, error } = useLogin();

  /*
  Si ya existe una sesión activa,
  evita mostrar nuevamente el login
  y redirige según el rol del usuario.
  */
  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const redirectPath = getAuthenticatedRedirectPath(user.rol);

    router.replace(redirectPath);
  }, [user, token, router]);

  /*
  Maneja el envío del formulario
  y delega la autenticación real
  al hook useLogin.
  */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await handleLogin(email, password);

    if (response) {
      const redirectPath = getAuthenticatedRedirectPath(response.usuario.rol);

      router.push(redirectPath);
    }
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
                onChange={(event) => setEmail(event.target.value)}
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
                onChange={(event) => setPassword(event.target.value)}
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

            <Link href="#" underline="none" sx={loginStyles.forgotPasswordLink}>
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
