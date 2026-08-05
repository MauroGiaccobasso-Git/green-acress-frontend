"use client";

import RequireAcceptedConsent from "@/components/auth/requireAcceptedConsent";
import RequireAuth from "@/components/auth/requireAuth";
import AvailableProductsContainer from "@/containers/member/AvailableProductsContainer";
import { MemberLayout } from "@/layouts/member/MemberLayout";

/*
Página de Productos disponibles
del Portal Socio.

La página compone exclusivamente:

- protección del rol SOCIO;
- validación del consentimiento informado;
- shell autenticado del Portal Socio;
- encabezado contextual del módulo;
- catálogo y creación de reservas.

La lógica de datos, borrador y creación
permanece dentro de sus hooks y container.
*/
export default function AvailableProductsPage() {
  return (
    <RequireAuth allowedRoles={["SOCIO"]}>
      <RequireAcceptedConsent>
        <MemberLayout
          title="Productos disponibles"
          subtitle="Elegí uno o varios productos, ajustá las cantidades y confirmá una única reserva."
        >
          <AvailableProductsContainer />
        </MemberLayout>
      </RequireAcceptedConsent>
    </RequireAuth>
  );
}