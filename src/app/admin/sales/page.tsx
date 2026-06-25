import RequireAuth from "@/components/auth/requireAuth";
import SalesContainer from "@/containers/sales/SalesContainer";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

/*
Ruta administrativa de ventas.

Responsabilidades:
- definir la ruta
- proteger acceso por rol ADMIN
- aplicar layout administrativo
- renderizar el container del módulo

NO contiene lógica.
NO realiza fetch.
NO implementa interfaz.
*/
export default function SalesPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout
        title="Ventas"
        subtitle="Registro de ventas presenciales a socios"
      >
        <SalesContainer />
      </AdminLayout>
    </RequireAuth>
  );
}