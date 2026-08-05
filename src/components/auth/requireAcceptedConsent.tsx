"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/auth/useAuth";

type RequireAcceptedConsentProps = {
  children: React.ReactNode;
};

/*
Protege exclusivamente las rutas internas
del Portal de Socios.

Debe utilizarse dentro de RequireAuth,
que previamente valida:

- sesión autenticada;
- token existente;
- rol SOCIO.

Este componente únicamente valida
que el socio ya haya aceptado
el consentimiento informado obligatorio.
*/
export default function RequireAcceptedConsent({
  children,
}: RequireAcceptedConsentProps) {
  const router = useRouter();

  const { user } = useAuth();

  const hasAcceptedConsent =
    user?.rol === "SOCIO" &&
    user.requiereConsentimiento === false;

  /*
  Un socio con consentimiento pendiente
  no puede acceder manualmente a ninguna
  ruta interna del Portal de Socios.

  Se utiliza replace para evitar que
  la ruta protegida quede en el historial.
  */
  useEffect(() => {
    if (hasAcceptedConsent) {
      return;
    }

    router.replace("/consentimiento");
  }, [hasAcceptedConsent, router]);

  /*
  Mientras se ejecuta la redirección,
  no se muestra contenido protegido.
  */
  if (!hasAcceptedConsent) {
    return null;
  }

  return <>{children}</>;
}