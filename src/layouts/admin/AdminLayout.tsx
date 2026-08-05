"use client";

import type { ReactNode } from "react";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import { useAuthentication } from "@/hooks/auth/useAuthentication";
import {
  AuthenticatedLayout,
  type AuthenticatedLayoutNavigationSection,
  type AuthenticatedLayoutUserMenuItem,
  useAuthenticatedLayoutHeaderActions,
} from "@/layouts/shared/AuthenticatedLayout";

/* =========================================================
   TIPOS
========================================================= */

type AdminLayoutProps = {
  children: ReactNode;

  title?: string;

  subtitle?: string;
};

/* =========================================================
   ACCIONES CONTEXTUALES DEL HEADER
========================================================= */

/*
Conserva la API pública utilizada actualmente
por los containers administrativos.

Internamente delega el comportamiento al shell
compartido de layouts autenticados.
*/
export function useAdminHeaderActions() {
  return useAuthenticatedLayoutHeaderActions();
}

/* =========================================================
   NAVEGACIÓN ADMINISTRATIVA
========================================================= */

const navigationSections: AuthenticatedLayoutNavigationSection[] = [
  {
    title: "Principal",
    items: [
      {
        label: "Inicio",
        href: "/admin",
        icon: <HomeOutlinedIcon fontSize="small" />,
      },
      {
        label: "Productos",
        href: "/admin/products",
        icon: <Inventory2OutlinedIcon fontSize="small" />,
      },
      {
        label: "Stock",
        href: "/admin/stock",
        icon: <Inventory2OutlinedIcon fontSize="small" />,
      },
      {
        label: "Ventas",
        href: "/admin/sales",
        icon: <PointOfSaleOutlinedIcon fontSize="small" />,
      },
      {
        label: "Reservas",
        href: "/admin/reservations",
        icon: <EventAvailableOutlinedIcon fontSize="small" />,
      },
      {
        label: "Socios",
        href: "/admin/members",
        icon: <GroupOutlinedIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "Proveedores",
    items: [
      {
        label: "Proveedores",
        href: "/admin/providers",
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
      },
      {
        label: "Compras",
        href: "/admin/purchases",
        icon: <ShoppingBagOutlinedIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "Configuración",
    items: [
      {
        label: "Novedades",
        href: "/admin/news",
        icon: <ArticleOutlinedIcon fontSize="small" />,
      },
      {
        label: "Configuración",
        href: "/admin/settings",
        icon: <SettingsOutlinedIcon fontSize="small" />,
      },
    ],
  },
];

/* =========================================================
   LAYOUT ADMINISTRATIVO
========================================================= */

/*
Configura el shell autenticado para el rol ADMIN.

Este componente conserva únicamente las decisiones
específicas del panel administrativo:

- navegación disponible;
- identidad visual del usuario;
- acciones del menú;
- textos accesibles;
- subtítulo de la marca.

La estructura visual y responsive permanece
centralizada dentro de AuthenticatedLayout.
*/
export function AdminLayout({
  children,
  title,
  subtitle,
}: AdminLayoutProps) {
  const {
    handleLogout: logoutSession,
    isLoggingOut,
  } = useAuthentication();

  /*
  La redirección continúa siendo resuelta por RequireAuth.

  Al limpiar la sesión local, RequireAuth detecta
  la ausencia del token y redirige hacia el login.
  */
  const handleLogout = async (): Promise<void> => {
    await logoutSession();
  };

  const userMenuItems: AuthenticatedLayoutUserMenuItem[] = [
    {
      id: "profile",
      label: "Mi perfil",
      disabled: true,
    },
    {
      id: "logout",
      label: isLoggingOut
        ? "Cerrando sesión..."
        : "Cerrar sesión",
      onClick: handleLogout,
      disabled: isLoggingOut,
    },
  ];

  return (
    <AuthenticatedLayout
      title={title}
      subtitle={subtitle}
      brandSubtitle="Club Cannábico"
      navigationSections={navigationSections}
      navigationAriaLabel="Navegación administrativa"
      openNavigationAriaLabel="Abrir navegación administrativa"
      toggleNavigationAriaLabel="Mostrar u ocultar navegación administrativa"
      userMenuId="admin-user-menu"
      userMenuAriaLabel="Abrir menú de usuario"
      user={{
        initials: "AD",
        name: "Admin",
        description: "Administrador",
      }}
      userMenuItems={userMenuItems}
      isUserMenuBusy={isLoggingOut}
      showMobileUserMenu={false}
    >
      {children}
    </AuthenticatedLayout>
  );
}