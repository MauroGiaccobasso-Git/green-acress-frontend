"use client";

import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/auth/useAuth";

type AllowedRole = "ADMIN" | "SOCIO";

type RequireAuthProps = {
  children: React.ReactNode;
  allowedRoles?: AllowedRole[];
};

// Protege rutas internas del sistema.
//
// Valida sesión activa y, opcionalmente,
// roles permitidos para acceder.
export default function RequireAuth({
  children,
  allowedRoles,
}: RequireAuthProps) {
  const router = useRouter();

  const { user, token } = useAuth();

  const hasRequiredRole =
    !allowedRoles || allowedRoles.includes(user?.rol as AllowedRole);

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }

    if (!hasRequiredRole) {
      router.replace("/");
    }
  }, [token, hasRequiredRole, router]);

  // Vista temporal mientras se valida
  // si el usuario puede acceder.
  if (!token || !hasRequiredRole) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f4f7f5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={32} />

        <Typography color="text.secondary" fontWeight={500}>
          Validando sesión...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}