import RequireAuth from "@/components/auth/requireAuth";
import ReservationsContainer from "@/containers/reservations/ReservationsContainer";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

/*
Ruta administrativa de reservas.

Responsabilidades:
- definir la ruta;
- proteger acceso por rol ADMIN;
- aplicar layout administrativo;
- renderizar el container del módulo.

NO contiene lógica.
NO realiza fetch.
NO implementa interfaz.
*/
export default function ReservationsPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout
        title="Reservas"
        subtitle="Gestión y control de reservas realizadas por los socios"
      >
        <ReservationsContainer />
      </AdminLayout>
    </RequireAuth>
  );
}
