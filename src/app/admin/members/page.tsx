import RequireAuth from "@/components/auth/requireAuth";
import MembersContainer from "@/containers/members/MembersContainer";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

/*
Ruta administrativa de socios.

Responsabilidades:
- definir la ruta;
- proteger el acceso por rol ADMIN;
- aplicar el layout administrativo;
- renderizar el container del módulo.

NO contiene lógica.
NO realiza fetch.
NO implementa interfaz.
*/
export default function MembersPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout
        title="Socios"
        subtitle="Gestión de socios, estados y accesos al sistema"
      >
        <MembersContainer />
      </AdminLayout>
    </RequireAuth>
  );
}