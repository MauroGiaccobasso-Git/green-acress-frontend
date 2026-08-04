"use client";

import type {
  MouseEvent,
  ReactNode,
} from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";

import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/auth/useAuth";

import { styles } from "./adminLayout.styles";

/* =========================================================
   TIPOS
========================================================= */

type AdminLayoutProps = {
  children: ReactNode;

  title?: string;

  subtitle?: string;
};

type AdminHeaderActionsContextValue = {
  setHeaderActions: (actions: ReactNode) => void;

  clearHeaderActions: () => void;
};

/* =========================================================
   CONTEXTO DE ACCIONES DEL HEADER
========================================================= */

/*
Permite que cada módulo administrativo agregue contenido
contextual al extremo derecho del header.

Ejemplos:
- fecha de actualización;
- botón de creación;
- filtros rápidos;
- acciones específicas de una pantalla.

El layout continúa siendo reutilizable y no necesita conocer
los datos ni la lógica interna de cada módulo.
*/
const AdminHeaderActionsContext =
  createContext<AdminHeaderActionsContextValue | null>(null);

/*
Hook utilizado por los containers que necesiten renderizar
una acción contextual dentro del header administrativo.

Debe utilizarse únicamente dentro de AdminLayout.
*/
export function useAdminHeaderActions() {
  const context = useContext(AdminHeaderActionsContext);

  if (!context) {
    throw new Error(
      "useAdminHeaderActions debe utilizarse dentro de AdminLayout.",
    );
  }

  return context;
}

/* =========================================================
   NAVEGACIÓN
========================================================= */

const navigationSections = [
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
   LAYOUT PRINCIPAL
========================================================= */

export function AdminLayout({
  children,
  title,
  subtitle,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] =
    useState(true);

  const [headerActions, setHeaderActionsState] =
    useState<ReactNode>(null);

  const isUserMenuOpen = Boolean(anchorEl);

  /* =========================================================
     ACCIONES DEL HEADER
  ========================================================= */

  const setHeaderActions = useCallback(
    (actions: ReactNode) => {
      setHeaderActionsState(() => actions);
    },
    [],
  );

  const clearHeaderActions = useCallback(() => {
    setHeaderActionsState(null);
  }, []);

  const headerActionsContextValue =
    useMemo<AdminHeaderActionsContextValue>(
      () => ({
        setHeaderActions,
        clearHeaderActions,
      }),
      [clearHeaderActions, setHeaderActions],
    );

  /* =========================================================
     HANDLERS DEL USUARIO
  ========================================================= */

  const handleOpenUserMenu = (
    event: MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  /* =========================================================
     HANDLERS DE NAVEGACIÓN
  ========================================================= */

  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleToggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen(
      (currentValue) => !currentValue,
    );
  };

  /* =========================================================
     BLOQUES REUTILIZABLES
  ========================================================= */

  const renderBrand = () => (
    <Box sx={styles.sidebarBrand}>
      <Avatar sx={styles.brandAvatar}>
        <SpaOutlinedIcon />
      </Avatar>

      <Box>
        <Typography
          variant="subtitle1"
          sx={styles.brandTitle}
        >
          Green Acres
        </Typography>

        <Typography
          variant="caption"
          sx={styles.brandSubtitle}
        >
          Club Cannábico
        </Typography>
      </Box>
    </Box>
  );

  const renderNavigation = (isMobile = false) => (
    <Box sx={styles.navigationSections}>
      {navigationSections.map((section) => (
        <Box
          key={section.title}
          sx={styles.navigationSection}
        >
          <Typography
            variant="overline"
            sx={styles.sidebarSectionTitle}
          >
            {section.title}
          </Typography>

          <List
            disablePadding
            sx={
              isMobile
                ? styles.mobileNavigationList
                : styles.navigationList
            }
          >
            {section.items.map((item) => {
              const isActive = pathname === item.href;

              return (
                <ListItemButton
                  key={item.href}
                  component="a"
                  href={item.href}
                  selected={isActive}
                  onClick={
                    isMobile
                      ? handleCloseMobileMenu
                      : undefined
                  }
                  sx={
                    isMobile
                      ? styles.mobileNavigationItem(
                          isActive,
                        )
                      : styles.sidebarNavigationItem(
                          isActive,
                        )
                  }
                >
                  <Box sx={styles.navigationIcon}>
                    {item.icon}
                  </Box>

                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: styles.navigationText(
                          isActive,
                        ),
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <AdminHeaderActionsContext.Provider
      value={headerActionsContextValue}
    >
      <Box sx={styles.page}>
        <Box
          component="aside"
          sx={styles.desktopSidebar(
            isDesktopSidebarOpen,
          )}
        >
          {renderBrand()}

          {renderNavigation()}

          <Box sx={styles.sidebarUserArea}>
            <Button
              onClick={handleOpenUserMenu}
              aria-label="Abrir menú de usuario"
              aria-controls={
                isUserMenuOpen
                  ? "admin-user-menu"
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={
                isUserMenuOpen
                  ? "true"
                  : undefined
              }
              endIcon={<KeyboardArrowDownIcon />}
              sx={styles.sidebarUserButton}
            >
              <Avatar sx={styles.userAvatar}>
                AD
              </Avatar>

              <Box sx={styles.userInfo}>
                <Typography
                  variant="body2"
                  sx={styles.userName}
                >
                  Admin
                </Typography>

                <Typography
                  variant="caption"
                  sx={styles.userEmail}
                >
                  Administrador
                </Typography>
              </Box>
            </Button>
          </Box>
        </Box>

        <Box
          sx={styles.mainShell(
            isDesktopSidebarOpen,
          )}
        >
          <AppBar
            position="sticky"
            elevation={0}
            sx={styles.appBar}
          >
            <Toolbar
              disableGutters
              sx={styles.toolbar}
            >
              <IconButton
                onClick={handleOpenMobileMenu}
                aria-label="Abrir navegación administrativa"
                sx={styles.mobileMenuButton}
              >
                <MenuIcon />
              </IconButton>

              <IconButton
                onClick={handleToggleDesktopSidebar}
                aria-label="Mostrar u ocultar navegación administrativa"
                sx={styles.desktopMenuButton}
              >
                <MenuIcon />
              </IconButton>

              <PageHeader
                title={title}
                subtitle={subtitle}
              />

              <Box sx={styles.toolbarSpacer} />

              {headerActions ? (
                <Box sx={styles.headerActions}>
                  {headerActions}
                </Box>
              ) : null}

              <Menu
                id="admin-user-menu"
                anchorEl={anchorEl}
                open={isUserMenuOpen}
                onClose={handleCloseUserMenu}
              >
                <MenuItem disabled>
                  Mi perfil
                </MenuItem>

                <MenuItem onClick={handleLogout}>
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          <Box
            component="main"
            sx={styles.content}
          >
            {children}
          </Box>
        </Box>

        <Drawer
          anchor="left"
          open={isMobileMenuOpen}
          onClose={handleCloseMobileMenu}
          slotProps={{
            paper: {
              sx: styles.mobileDrawerPaper,
            },
          }}
        >
          <Box
            sx={styles.mobileDrawer}
            role="navigation"
          >
            <Box sx={styles.mobileDrawerHeader}>
              {renderBrand()}
            </Box>

            {renderNavigation(true)}
          </Box>
        </Drawer>
      </Box>
    </AdminHeaderActionsContext.Provider>
  );
}