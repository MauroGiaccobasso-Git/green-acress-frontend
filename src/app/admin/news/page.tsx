import RequireAuth from "@/components/auth/requireAuth";
import NewsContainer from "@/containers/news/NewsContainer";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

/*
Ruta administrativa de novedades.

Responsabilidades:
- definir la ruta /admin/news;
- proteger el acceso exclusivamente para ADMIN;
- aplicar el layout administrativo existente;
- renderizar el container principal del módulo.

NO contiene lógica de negocio.
NO realiza solicitudes HTTP.
NO administra estado.
NO implementa componentes visuales.
*/
export default function NewsPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout
        title="Novedades"
        subtitle="Gestión y publicación de novedades para los socios"
      >
        <NewsContainer />
      </AdminLayout>
    </RequireAuth>
  );
}