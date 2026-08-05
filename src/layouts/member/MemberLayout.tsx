"use client";

import type { ReactNode } from "react";
import { useCallback } from "react";

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useRouter } from "next/navigation";

import { useAuthentication } from "@/hooks/auth/useAuthentication";
import {
  AuthenticatedLayout,
  type AuthenticatedLayoutActiveMatcher,
  type AuthenticatedLayoutNavigationSection,
  useAuthenticatedLayoutHeaderActions,
} from "@/layouts/shared/AuthenticatedLayout";

/* =========================================================
   TIPOS
========================================================= */

type MemberLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

/* =========================================================
   ACCIONES CONTEXTUALES DEL HEADER
========================================================= */

/*
Mantiene una API semántica propia para los módulos
pertenecientes al Portal Socio.

Internamente delega el comportamiento al shell
compartido de layouts autenticados.
*/
export function useMemberHeaderActions() {
  return useAuthenticatedLayoutHeaderActions();
}

/* =========================================================
   NAVEGACIÓN DEL PORTAL SOCIO
========================================================= */

/*
Navegación definitiva del Portal Socio:

- /socio:
  perfil e información legal mensual;

- /socio/reservas:
  reservas activas, historial y detalle;

- /socio/reservar:
  productos disponibles y creación de reservas;

- /socio/novedades:
  novedades activas publicadas por el club.

La landing del socio es su perfil.
No existe una ruta duplicada /socio/perfil.
*/
const navigationSections: AuthenticatedLayoutNavigationSection[] = [
  {
    title: "Portal del socio",
    items: [
      {
        label: "Mi perfil",
        href: "/socio",
        icon: (
          <PersonOutlineOutlinedIcon fontSize="small" />
        ),
      },
      {
        label: "Mis reservas",
        href: "/socio/reservas",
        icon: (
          <EventAvailableOutlinedIcon fontSize="small" />
        ),
      },
      {
        label: "Productos disponibles",
        href: "/socio/reservar",
        icon: (
          <Inventory2OutlinedIcon fontSize="small" />
        ),
      },
      {
        label: "Novedades",
        href: "/socio/novedades",
        icon: (
          <ArticleOutlinedIcon fontSize="small" />
        ),
      },
    ],
  },
];

/*
La ruta principal sólo se activa mediante
coincidencia exacta.

Las demás opciones admiten rutas internas,
por ejemplo:

/socio/reservas/29
*/
const isMemberNavigationItemActive: AuthenticatedLayoutActiveMatcher = (
  pathname,
  item,
) => {
  if (item.href === "/socio") {
    return pathname === item.href;
  }

  return (
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`)
  );
};

/* =========================================================
   LAYOUT DEL PORTAL SOCIO
========================================================= */

/*
Configura el shell autenticado para usuarios SOCIO.

Conserva únicamente decisiones propias del portal:

- navegación disponible;
- cierre de sesión inferior;
- textos accesibles;
- estrategia de selección de rutas.

La estructura visual y responsive permanece
centralizada en AuthenticatedLayout.
*/
export function MemberLayout({
  children,
  title,
  subtitle,
}: MemberLayoutProps) {
  const router = useRouter();

  const {
    handleLogout: logoutSession,
    isLoggingOut,
  } = useAuthentication();

  /*
  Ejecuta el cierre completo de sesión:

  - solicita la revocación del JWT en backend;
  - limpia siempre la sesión local;
  - reemplaza la ruta actual por el login.
  */
  const handleLogout =
    useCallback(async (): Promise<void> => {
      await logoutSession();

      router.replace("/");
    }, [logoutSession, router]);

  return (
    <AuthenticatedLayout
      title={title}
      subtitle={subtitle}
      brandSubtitle="Portal de Socios"
      navigationSections={navigationSections}
      navigationAriaLabel="Navegación del Portal Socio"
      openNavigationAriaLabel="Abrir navegación del Portal Socio"
      toggleNavigationAriaLabel="Mostrar u ocultar navegación del Portal Socio"
      userMenuId="member-user-menu"
      userMenuAriaLabel="Abrir menú del socio"
      user={{
        initials: "SO",
        name: "Socio",
        description: "Portal de socios",
      }}
      userMenuItems={[]}
      isUserMenuBusy={isLoggingOut}
      showDesktopUserMenu={false}
      showMobileUserMenu={false}
      sidebarFooterAction={{
        label: isLoggingOut
          ? "Cerrando sesión..."
          : "Cerrar sesión",
        icon: (
          <LogoutOutlinedIcon fontSize="small" />
        ),
        onClick: handleLogout,
        disabled: isLoggingOut,
        ariaLabel: isLoggingOut
          ? "Cerrando sesión"
          : "Cerrar sesión",
      }}
      isNavigationItemActive={
        isMemberNavigationItemActive
      }
    >
      {children}
    </AuthenticatedLayout>
  );
}