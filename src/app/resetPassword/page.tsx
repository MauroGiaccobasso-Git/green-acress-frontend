import ResetPasswordContainer from "@/containers/auth/ResetPasswordContainer";

/*
==================================================
RUTA DE RESTABLECIMIENTO DE CONTRASEÑA
==================================================
*/

/*
Propiedades recibidas por la página.

Next.js entrega los parámetros de búsqueda
presentes en la URL.

El correo genera enlaces con esta estructura:

/resetPassword?token=...
*/
type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

/*
Ruta correspondiente al flujo de
restablecimiento de contraseña.

Responsabilidades:

- recibir el token desde la URL;
- normalizar el parámetro;
- renderizar el container;
- no contener lógica de negocio;
- no realizar llamadas al backend.
*/
export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  /*
  En versiones actuales de Next.js,
  searchParams puede entregarse como Promise.

  La página resuelve el valor antes
  de pasarlo al container.
  */
  const resolvedSearchParams = await searchParams;

  /*
  Evita aceptar múltiples valores
  para un único token.

  Si Next.js entrega un array,
  se utiliza solamente el primer valor.
  */
  const tokenValue = resolvedSearchParams.token;

  const token = Array.isArray(tokenValue)
    ? tokenValue[0] ?? null
    : tokenValue ?? null;

  return <ResetPasswordContainer token={token} />;
}