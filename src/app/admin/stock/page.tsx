import RequireAuth from "@/components/auth/requireAuth";
import StockContainer from "@/containers/stock/StockContainer";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

/*
Ruta administrativa de stock.

Responsabilidades:
- definir la ruta;
- proteger acceso por rol ADMIN;
- aplicar layout administrativo;
- renderizar el container del módulo.

NO contiene lógica.
NO realiza fetch.
NO implementa interfaz.
*/
export default function StockPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout
        title="Stock"
        subtitle="Control operativo de inventario y ajustes manuales"
      >
        <StockContainer />
      </AdminLayout>
    </RequireAuth>
  );
}