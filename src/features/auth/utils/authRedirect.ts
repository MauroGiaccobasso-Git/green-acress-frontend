// Rutas principales utilizadas después
// de una autenticación exitosa.
const AUTH_REDIRECT_ROUTES = {
  ADMIN: "/admin",
  SOCIO: "/socio",
} as const;

// Roles esperados desde el backend.
type AuthRole = keyof typeof AUTH_REDIRECT_ROUTES;

// Resuelve la ruta inicial según
// el rol del usuario autenticado.
//
// Centralizar esta lógica evita que
// LoginContainer tenga decisiones
// de navegación hardcodeadas.
export const getAuthenticatedRedirectPath = (
  role: AuthRole
): string => {
  return AUTH_REDIRECT_ROUTES[role];
};