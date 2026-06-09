"use client";

import { Box, Typography } from "@mui/material";

import RequireAuth from "@/components/auth/requireAuth";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

// Pantalla administrativa inicial.
//
// Funciona como punto de entrada del panel,
// reutilizando el layout común del administrador.
export default function AdminPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: "#0b2d1f",
              mb: 2,
            }}
          >
            Panel administrativo
          </Typography>

          <Typography color="text.secondary">
            Seleccioná una sección del menú para comenzar a gestionar el sistema.
          </Typography>
        </Box>
      </AdminLayout>
    </RequireAuth>
  );
}