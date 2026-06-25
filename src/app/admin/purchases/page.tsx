import RequireAuth from "@/components/auth/requireAuth";
import PurchasesContainer from "@/containers/purchases/PurchasesContainer";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

/*
Ruta administrativa de compras.

Responsabilidades:
- definir la ruta
- proteger acceso por rol ADMIN
- aplicar layout administrativo
- renderizar el container del módulo

NO contiene lógica.
NO realiza fetch.
NO implementa interfaz.
*/
export default function PurchasesPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout
        title="Compras"
        subtitle="Registro de compras a proveedores"
      >
        <PurchasesContainer />
      </AdminLayout>
    </RequireAuth>
  );
}