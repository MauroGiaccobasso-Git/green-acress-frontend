import RequireAuth from "@/components/auth/requireAuth";
import DashboardContainer from "@/containers/dashboard/DashboardContainer";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

/*
Ruta principal del panel administrativo.

Responsabilidades:
- definir la ruta /admin;
- proteger el acceso exclusivamente para ADMIN;
- aplicar el layout administrativo compartido;
- renderizar el container del Dashboard.

NO contiene lógica de negocio.
NO realiza solicitudes HTTP.
NO administra estados.
NO implementa componentes visuales internos.
*/
export default function AdminPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout
        title="Resumen administrativo"
        subtitle="Indicadores, alertas operativas y recomendaciones para la gestión diaria del club"
      >
        <DashboardContainer />
      </AdminLayout>
    </RequireAuth>
  );
}