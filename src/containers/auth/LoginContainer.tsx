"use client";

import { useState } from "react";

// Container de la pantalla de login.
// Este archivo contiene la interfaz principal del flujo de autenticación.
//
// La ruta "/" se define en src/app/page.tsx,
// pero el contenido visual y funcional del login vive en este container.
// De esta forma mantenemos separadas las responsabilidades:
// - page.tsx define la ruta.
// - LoginContainer.tsx define la pantalla de login.

import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
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

  // Maneja el envío del formulario de login.
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Evita el comportamiento por defecto del navegador
    // al enviar formularios HTML.
    event.preventDefault();
  };
  return (
    // Contenedor principal de la pantalla.
    // Ocupa todo el alto del navegador y centra la tarjeta del login.
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
      {/* Contenedor responsive.
          maxWidth="xs" mantiene un ancho similar a mobile,
          alineado con el enfoque mobile first del proyecto. */}
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2.5,
        }}
      >
        {/* Encabezado visual del sistema */}
        <Stack
          spacing={1.5}
          mb={3}
          sx={{
            alignItems: "center",
          }}
        >
          {/* Logo temporal del sistema.
                Más adelante puede reemplazarse por un logo real. */}
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

          {/* Nombre y descripción breve del sistema */}
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                color: "#123d2a",
                letterSpacing: "-0.04em",
              }}
            >
              Green Acres
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#4f6f5d",
                fontWeight: 500,
              }}
            >
              Gestión inteligente para clubes
            </Typography>
          </Box>
        </Stack>
        {/* Tarjeta principal del formulario de login */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            p: {
              xs: 2.5,
              sm: 3,
            },
            borderRadius: 5,
            bgcolor: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255, 255, 255, 0.65)",
            boxShadow: "0 24px 60px rgba(18, 61, 42, 0.22)",
          }}
        >
          {/* Contenido principal del formulario */}
          <Stack component="form" spacing={1.7} onSubmit={handleSubmit}>
            {/* Título de la sección */}
            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  color: "#123d2a",
                  letterSpacing: "-0.03em",
                }}
              >
                Inicio de sesión
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#4f6f5d",
                  fontWeight: 500,
                }}
              >
                Accedé con tus credenciales para continuar.
              </Typography>
            </Box>

            {/* Campo de correo electrónico */}
            <Stack spacing={0.7}>
              <Typography
                variant="body2"
                sx={{
                  color: "#123d2a",
                  fontWeight: 700,
                }}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "rgba(250, 252, 250, 0.92)",
                  },
                }}
              />
            </Stack>

            {/* Campo de contraseña */}
            <Stack spacing={0.7}>
              <Typography
                variant="body2"
                sx={{
                  color: "#123d2a",
                  fontWeight: 700,
                }}
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "rgba(250, 252, 250, 0.92)",
                  },
                }}
              />
            </Stack>

            {/* Opción visual de recordar sesión.
                La lógica real se implementará más adelante. */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  sx={{
                    color: "#6b7d70",
                    "&.Mui-checked": {
                      color: "#2f6f46",
                    },
                  }}
                />
              }
              label="Recordar sesión"
              sx={{
                color: "#263b2f",
                fontWeight: 500,
              }}
            />

            {/* 
              Mensaje de error representativo.
              Se activará más adelante cuando el formulario se conecte
              con la lógica real de autenticación del backend.

              <Alert severity="error">
                Credenciales inválidas. Intente nuevamente.
              </Alert>
            */}

            {/* Botón principal del formulario */}
            <Button
              variant="contained"
              size="large"
              fullWidth
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
              Iniciar sesión
            </Button>

            {/* Enlace preparado para futura recuperación de contraseña */}
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

            {/* Bloque informativo sobre MFA.
                Refleja el flujo definido en el anteproyecto:
                primero credenciales, luego código de verificación. */}
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
