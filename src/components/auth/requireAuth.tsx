"use client";

import { useEffect } from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/auth/useAuth";
import { colors } from "@/theme/colors";

/*
Roles permitidos actualmente
dentro del sistema.

Se utiliza para restringir
pantallas protegidas.
*/
type AllowedRole = "ADMIN" | "SOCIO";

/*
Propiedades esperadas
por RequireAuth.

children:

contenido protegido.

allowedRoles:

roles autorizados
(opcional).
*/
type RequireAuthProps = {
  children: React.ReactNode;

  allowedRoles?: AllowedRole[];
};

/*
Componente encargado de proteger
rutas privadas del sistema.

Su responsabilidad es validar:

- existencia de sesión

- existencia de token

- permisos por rol

Si alguna validación falla:

redirige usuario.

Este componente NO conoce backend.

Este componente NO hace fetch.

Este componente solamente decide:

"puede entrar"

o

"no puede entrar"
*/
export default function RequireAuth({
  children,

  allowedRoles,
}: RequireAuthProps) {
  /*
  Router utilizado para realizar
  redirecciones automáticas.
  */

  const router = useRouter();

  /*
  Obtiene información global
  de autenticación.

  useAuth obtiene datos desde:

  AuthProvider

  ↓

  AuthContext

  ↓

  sesión actual
  */

  const { user, token } = useAuth();

  /*
  Determina si el usuario posee
  permisos suficientes.

  Casos:

  NO se envían roles:

  ↓

  cualquier usuario autenticado entra

  Se envían roles:

  ↓

  usuario debe pertenecer
  a la lista permitida
  */

  const hasRequiredRole =
    !allowedRoles || allowedRoles.includes(user?.rol as AllowedRole);

  /*
  Ejecuta validaciones de acceso.

  Se ejecuta cuando cambia:

  - token

  - rol

  - router

  - permisos
  */

  useEffect(() => {
    /*
    Usuario sin token.

    Se considera sin sesión.
    */

    if (!token) {
      router.replace("/");

      return;
    }

    /*
    Usuario autenticado pero
    sin permisos suficientes.
    */

    if (!hasRequiredRole) {
      router.replace("/");
    }
  }, [token, hasRequiredRole, router]);

  /*
  Mientras se valida acceso
  mostramos una pantalla temporal.

  Esto evita:

  - flashes visuales

  - contenido protegido visible

  - render incorrecto
  */

  if (!token || !hasRequiredRole) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: colors.background.app,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={32} />

        <Typography
          variant="body2"
          sx={{
            color: colors.text.secondary,
          }}
        >
          Validando sesión...
        </Typography>
      </Box>
    );
  }

  /*
  Usuario autenticado
  y autorizado.

  Permite visualizar
  contenido protegido.
  */

  return <>{children}</>;
}