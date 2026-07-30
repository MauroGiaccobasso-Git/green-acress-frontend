/*
Pantalla correspondiente al segundo paso
del proceso de autenticación.

Su única responsabilidad es renderizar
el container encargado de completar
la verificación MFA.
*/

import VerifyMfaContainer from "@/containers/auth/VerifyMfaContainer";

export default function VerifyMfaPage() {
  return <VerifyMfaContainer />;
}