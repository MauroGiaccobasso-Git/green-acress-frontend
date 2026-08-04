import RequireAuth from "@/components/auth/requireAuth";
import RequirePendingConsent from "@/components/auth/requirePendingConsent";
import ConsentContainer from "@/containers/auth/ConsentContainer";

/*
Página de acceso al flujo
de consentimiento informado.

Responsabilidad:

- componer las protecciones de acceso;
- montar el container correspondiente.

Las reglas quedan separadas:

- RequireAuth valida sesión y rol;
- RequirePendingConsent valida el estado del flujo;
- ConsentContainer administra la interfaz.
*/
export default function ConsentimientoPage() {
  return (
    <RequireAuth allowedRoles={["SOCIO"]}>
      <RequirePendingConsent>
        <ConsentContainer />
      </RequirePendingConsent>
    </RequireAuth>
  );
}