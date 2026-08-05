"use client";

import RequireAcceptedConsent from "@/components/auth/requireAcceptedConsent";
import RequireAuth from "@/components/auth/requireAuth";
import MemberNewsContainer from "@/containers/member/MemberNewsContainer";
import { MemberLayout } from "@/layouts/member/MemberLayout";

/*
Página de Novedades
del Portal Socio.

La página compone exclusivamente:

- protección del rol SOCIO;
- validación del consentimiento informado;
- shell autenticado del Portal Socio;
- encabezado contextual del módulo;
- listado de novedades activas.

La consulta, los estados y la presentación
permanecen dentro del hook y el container.
*/
export default function MemberNewsPage() {
  return (
    <RequireAuth allowedRoles={["SOCIO"]}>
      <RequireAcceptedConsent>
        <MemberLayout
          title="Novedades"
          subtitle="Mantenete al día con las noticias del club."
        >
          <MemberNewsContainer />
        </MemberLayout>
      </RequireAcceptedConsent>
    </RequireAuth>
  );
}