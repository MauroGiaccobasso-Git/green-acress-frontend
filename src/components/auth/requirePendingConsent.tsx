"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/auth/useAuth";

type RequirePendingConsentProps = {
  children: React.ReactNode;
};

/*
Protege exclusivamente el flujo
de consentimiento informado.

Debe utilizarse dentro de RequireAuth,
que previamente valida:

- sesión autenticada;
- token existente;
- rol SOCIO.

Este componente únicamente valida
que el socio todavía tenga pendiente
la aceptación del consentimiento.
*/
export default function RequirePendingConsent({
  children,
}: RequirePendingConsentProps) {
  const router = useRouter();

  const { user } = useAuth();

  const hasPendingConsent =
    user?.rol === "SOCIO" &&
    user.requiereConsentimiento === true;

  /*
  Un socio que ya aceptó el consentimiento
  no puede volver a ingresar manualmente
  escribiendo la URL.

  Se utiliza replace para evitar que
  la ruta inválida quede en el historial.
  */
  useEffect(() => {
    if (hasPendingConsent) {
      return;
    }

    router.replace("/");
  }, [hasPendingConsent, router]);

  /*
  Mientras se ejecuta la redirección,
  no se muestra el formulario.
  */
  if (!hasPendingConsent) {
    return null;
  }

  return <>{children}</>;
}