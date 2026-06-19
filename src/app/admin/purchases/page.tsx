"use client";

import { AdminLayout } from "@/layouts/admin/AdminLayout";
import PurchasesContainer from "@/containers/purchases/PurchasesContainer";

/*
Página principal del módulo de compras.

Se renderiza dentro del layout administrativo
para mantener sidebar, header y navegación
consistente con el resto del panel.
*/
export default function PurchasesPage() {
  return (
    <AdminLayout title="Compras" subtitle="Registrar nueva compra">
      <PurchasesContainer />
    </AdminLayout>
  );
}
