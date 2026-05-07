// Página principal de la aplicación.
// En Next.js, este archivo representa la ruta raíz "/".
//
// Su responsabilidad es únicamente renderizar
// el container correspondiente a esta pantalla,
// manteniendo separada la lógica visual de la capa de rutas.

import LoginContainer from "@/containers/auth/LoginContainer";

// Renderiza la pantalla inicial de autenticación.
export default function HomePage() {
  return <LoginContainer />;
}