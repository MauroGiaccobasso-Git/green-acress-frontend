import RequireAuth from "@/components/auth/requireAuth";

import { ProductsContainer } from "@/containers/products/ProductsContainer";

/*
Ruta administrativa de productos.

Responsabilidades:

- definir la ruta

- proteger acceso

- renderizar container

NO contiene lógica.

NO realiza fetch.

NO implementa interfaz.
*/
export default function ProductsPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <ProductsContainer />
    </RequireAuth>
  );
}