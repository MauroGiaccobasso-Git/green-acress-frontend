"use client";

import RequireAcceptedConsent from "@/components/auth/requireAcceptedConsent";
import RequireAuth from "@/components/auth/requireAuth";
import MemberReservationsContainer from "@/containers/member/MemberReservationsContainer";
import { MemberLayout } from "@/layouts/member/MemberLayout";

/*
Página Mis reservas
del Portal Socio.

Responsabilidades:

- restringir el acceso al rol SOCIO;
- verificar el consentimiento informado;
- utilizar el layout compartido del portal;
- definir el encabezado contextual;
- montar el container principal.

La consulta, los estados, el detalle
y la presentación permanecen fuera
de esta capa.
*/
export default function MemberReservationsPage() {
  return (
    <RequireAuth allowedRoles={["SOCIO"]}>
      <RequireAcceptedConsent>
        <MemberLayout
          title="Mis reservas"
          subtitle="Consultá tus reservas activas y revisá tu historial."
        >
          <MemberReservationsContainer />
        </MemberLayout>
      </RequireAcceptedConsent>
    </RequireAuth>
  );
}