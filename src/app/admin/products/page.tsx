import RequireAuth from "@/components/auth/requireAuth";
import { ProductsContainer } from "@/containers/products/ProductsContainer";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

/*
Ruta administrativa de productos.

Responsabilidades:
- definir la ruta
- proteger acceso
- aplicar layout administrativo
- renderizar container

NO contiene lógica.
NO realiza fetch.
NO implementa interfaz.
*/
export default function ProductsPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout
        title="Productos"
        subtitle="Gestión del catálogo de productos del club"
      >
        <ProductsContainer />
      </AdminLayout>
    </RequireAuth>
  );
}