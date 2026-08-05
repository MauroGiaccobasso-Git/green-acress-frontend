"use client";

import RequireAcceptedConsent from "@/components/auth/requireAcceptedConsent";
import RequireAuth from "@/components/auth/requireAuth";
import MemberProfileContainer from "@/containers/member/MemberProfileContainer";
import { MemberLayout } from "@/layouts/member/MemberLayout";

/*
Página principal del Portal Socio.

Compone las responsabilidades necesarias:

- protege el acceso para usuarios SOCIO;
- exige el consentimiento informado aceptado;
- utiliza el layout autenticado del portal;
- presenta el perfil real del socio.
*/
export default function SocioPage() {
  return (
    <RequireAuth allowedRoles={["SOCIO"]}>
      <RequireAcceptedConsent>
        <MemberLayout
          title="Mi perfil"
          subtitle="Revisá tu información personal y el resumen de tu límite legal mensual."
        >
          <MemberProfileContainer />
        </MemberLayout>
      </RequireAcceptedConsent>
    </RequireAuth>
  );
}