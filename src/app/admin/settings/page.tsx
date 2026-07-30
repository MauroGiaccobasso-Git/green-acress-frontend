import RequireAuth from "@/components/auth/requireAuth";
import SettingsContainer from "@/containers/settings/SettingsContainer";
import { AdminLayout } from "@/layouts/admin/AdminLayout";

/*
Ruta administrativa de configuración.

Responsabilidades:

- definir la ruta
- proteger acceso por rol ADMIN
- aplicar layout administrativo
- renderizar el container del módulo

NO contiene lógica.
NO realiza fetch.
NO implementa interfaz.
*/
export default function SettingsPage() {
  return (
    <RequireAuth allowedRoles={["ADMIN"]}>
      <AdminLayout
        title="Configuración"
        subtitle="Administración de seguridad y acceso de la cuenta"
      >
        <SettingsContainer />
      </AdminLayout>
    </RequireAuth>
  );
}