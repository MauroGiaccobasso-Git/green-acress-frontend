"use client";

import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import RequireAuth from "@/components/auth/requireAuth";
import { useAuth } from "@/hooks/auth/useAuth";

// Pantalla inicial del portal de socio.
//
// Funciona como base temporal para validar
// el flujo autenticado del rol SOCIO.
export default function SocioPage() {
  const router = useRouter();

  const { logout } = useAuth();

  // Cierra sesión y vuelve al login.
  const handleLogout = () => {
    logout();

    router.push("/");
  };

  return (
    // Protege contenido permitiendo acceso
    // únicamente a usuarios SOCIO autenticados.
    <RequireAuth allowedRoles={["SOCIO"]}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f4f7f5",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              border: "1px solid #dbe5dd",
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              color="#1f3d2b"
              gutterBottom
            >
              Portal del socio
            </Typography>

            <Typography color="text.secondary" mb={3}>
              Sesión iniciada correctamente. Esta pantalla funcionará como base
              inicial para el portal de socios del sistema.
            </Typography>

            <Button variant="outlined" color="error" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Paper>
        </Container>
      </Box>
    </RequireAuth>
  );
}