"use client";

import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/auth/useAuth";
import RequireAuth from "@/components/auth/requireAuth";

// Pantalla administrativa inicial.
//
// Actualmente funciona como pantalla base
// para validar autenticación, persistencia,
// protección de rutas y logout.
export default function AdminPage() {
  const router = useRouter();

  const { logout } = useAuth();

  // Ejecuta cierre de sesión completo
  // y redirige nuevamente al login.
  const handleLogout = () => {
    logout();

    router.push("/");
  };

  return (
    // Protege contenido interno
    // permitiendo acceso únicamente
    // a usuarios ADMIN autenticados.
    <RequireAuth allowedRoles={["ADMIN"]}>
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
              Panel administrativo
            </Typography>

            <Typography color="text.secondary" mb={3}>
              Sesión iniciada correctamente. Esta pantalla funcionará como base
              inicial para el dashboard administrativo del sistema.
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
