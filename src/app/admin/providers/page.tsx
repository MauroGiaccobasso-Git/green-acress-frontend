import RequireAuth from "@/components/auth/requireAuth";
import ProvidersContainer from "@/containers/providers/ProvidersContainer";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

/*
Ruta administrativa de proveedores.

Responsabilidades:
- definir la ruta;
- proteger el acceso por rol ADMIN;
- aplicar el layout administrativo;
- renderizar el container del módulo.

NO contiene lógica.
NO realiza solicitudes HTTP.
NO implementa interfaz.
*/
export default function ProvidersPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout
        title="Proveedores"
        subtitle="Gestión y administración de proveedores del club"
      >
        <ProvidersContainer />
      </AdminLayout>
    </RequireAuth>
  );
}