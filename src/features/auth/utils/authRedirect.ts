/*
Define las rutas principales
a las que será enviado el usuario
luego de iniciar sesión correctamente.

Cada rol del sistema tiene asociada
una ruta inicial.

Esto permite centralizar la decisión
de navegación posterior al login.
*/
const AUTH_REDIRECT_ROUTES = {
  /*
  Ruta inicial para usuarios
  con rol ADMIN.

  Representa el panel administrativo.
  */
  ADMIN: "/admin",

  /*
  Ruta inicial para usuarios
  con rol SOCIO.

  Representa el portal del socio.
  */
  SOCIO: "/socio",
} as const;

/*
Define los roles válidos para
esta lógica de redirección.

keyof toma automáticamente las claves
del objeto AUTH_REDIRECT_ROUTES.

En este caso genera:

ADMIN | SOCIO

Esto evita escribir los roles dos veces
y mantiene el tipo alineado con las rutas.
*/
type AuthRole =
  keyof typeof AUTH_REDIRECT_ROUTES;

/*
Resuelve la ruta inicial según
el rol del usuario autenticado.

Recibe un rol y devuelve la ruta
correspondiente.

Centralizar esta lógica evita que
LoginContainer tenga decisiones
de navegación hardcodeadas.

De esta forma, si mañana cambia
la ruta de ADMIN o SOCIO, se modifica
únicamente este archivo.
*/
export const getAuthenticatedRedirectPath = (
  role: AuthRole
): string => {
  /*
  Busca dentro del objeto de rutas
  la ruta asociada al rol recibido.
  */
  return AUTH_REDIRECT_ROUTES[role];
};