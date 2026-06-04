"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth/useLogin";
import { getAuthenticatedRedirectPath } from "@/features/auth/utils/authRedirect";

// Container de la pantalla de login.
// Este archivo contiene la interfaz principal del flujo de autenticación.
//
// La ruta "/" se define en src/app/page.tsx,
// pero el contenido visual y funcional del login vive en este container.
// De esta forma mantenemos separadas las responsabilidades:
// - page.tsx define la ruta.
// - LoginContainer.tsx define la pantalla de login.

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

// Componente principal del container de login.
export default function LoginContainer() {
  // Estado de los campos del formulario de autenticación.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Hook encargado del flujo real de autenticación.
  const { handleLogin, isLoading, error } = useLogin();
  // Permite navegar programáticamente entre rutas
  const router = useRouter();
  const { user, token } = useAuth();

  // Si ya existe una sesión activa,
  // evita mostrar nuevamente el login.
  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const redirectPath = getAuthenticatedRedirectPath(user.rol);

    router.replace(redirectPath);
  }, [user, token, router]);

  // Maneja el envío del formulario de login.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Evita que el navegador recargue la página al enviar el formulario.
    event.preventDefault();

    // Ejecuta el login real utilizando las credenciales ingresadas.
    const response = await handleLogin(email, password);

    if (response) {
      const redirectPath = getAuthenticatedRedirectPath(response.usuario.rol);

      router.push(redirectPath);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(180deg, rgba(244, 248, 242, 0.28) 0%, rgba(244, 248, 242, 0.18) 45%, rgba(244, 248, 242, 0.08) 100%), url('/images/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 3,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2.5,
        }}
      >
        <Stack spacing={1.5} mb={3} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "#2f6f46",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: 24,
            }}
          >
            G
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{ color: "#123d2a", letterSpacing: "-0.04em" }}
            >
              Green Acres
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#4f6f5d", fontWeight: 500 }}
            >
              Gestión inteligente para clubes
            </Typography>
          </Box>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            p: { xs: 2.5, sm: 3 },
            borderRadius: 5,
            bgcolor: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.65)",
            boxShadow: "0 24px 60px rgba(18, 61, 42, 0.22)",
          }}
        >
          <Stack component="form" spacing={1.7} onSubmit={handleSubmit}>
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{ color: "#123d2a", letterSpacing: "-0.03em" }}
              >
                Inicio de sesión
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#4f6f5d", fontWeight: 500 }}
              >
                Accedé con tus credenciales para continuar.
              </Typography>
            </Box>

            <Stack spacing={0.7}>
              <Typography
                variant="body2"
                sx={{ color: "#123d2a", fontWeight: 700 }}
              >
                Correo electrónico
              </Typography>

              <TextField
                placeholder="Ingresá tu correo electrónico"
                name="email"
                type="email"
                fullWidth
                size="small"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "rgba(250, 252, 250, 0.92)",
                  },
                }}
              />
            </Stack>

            <Stack spacing={0.7}>
              <Typography
                variant="body2"
                sx={{ color: "#123d2a", fontWeight: 700 }}
              >
                Contraseña
              </Typography>

              <TextField
                placeholder="Ingresá tu contraseña"
                name="password"
                type="password"
                fullWidth
                size="small"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "rgba(250, 252, 250, 0.92)",
                  },
                }}
              />
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading}
              sx={{
                bgcolor: "#2f6f46",
                textTransform: "none",
                fontWeight: 700,
                py: 1.2,
                "&:hover": {
                  bgcolor: "#255a38",
                },
              }}
            >
              {isLoading ? "Ingresando..." : "Iniciar sesión"}
            </Button>

            <Link
              href="#"
              underline="none"
              sx={{
                textAlign: "center",
                fontSize: 14,
                fontWeight: 600,
                color: "#4f6f5d",
                transition: "0.2s ease",
                "&:hover": {
                  color: "#2f6f46",
                },
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>

            <Box
              sx={{
                mt: 0.5,
                p: 2,
                borderRadius: 3,
                bgcolor: "rgba(238, 245, 239, 0.78)",
                border: "1px solid rgba(173, 201, 180, 0.45)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="subtitle2" fontWeight={700}>
                Verificación en dos pasos
              </Typography>

              <Typography variant="body2" color="text.secondary">
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
