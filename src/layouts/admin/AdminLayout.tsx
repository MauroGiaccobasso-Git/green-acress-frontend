"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";

import { useAuth } from "@/hooks/auth/useAuth";
import { styles } from "./adminLayout.styles";
import { PageHeader } from "@/components/common/PageHeader";

type AdminLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

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
        disabled: false,
        icon: <Inventory2OutlinedIcon fontSize="small" />,
      },
      {
        label: "Ventas",
        href: "/admin/sales",
        disabled: false,
        icon: <PointOfSaleOutlinedIcon fontSize="small" />,
      },
      {
        label: "Reservas",
        href: "/admin/reservations",
        disabled: false,
        icon: <EventAvailableOutlinedIcon fontSize="small" />,
      },
      {
        label: "Socios",
        href: "/admin/members",
        disabled: false,
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
        disabled: false,
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
      },
      {
        label: "Compras",
        href: "/admin/purchases",
        disabled: false,
        icon: <ShoppingBagOutlinedIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "Configuración",
    items: [
      {
        label: "Usuarios",
        href: "/admin/users",
        disabled: true,
        icon: <GroupOutlinedIcon fontSize="small" />,
      },
      {
        label: "Novedades",
        href: "/admin/news",
        disabled: false,
        icon: <ArticleOutlinedIcon fontSize="small" />,
      },
      {
        label: "Configuración",
        href: "/admin/settings",
        disabled: false,
        icon: <SettingsOutlinedIcon fontSize="small" />,
      },
    ],
  },
];

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const isUserMenuOpen = Boolean(anchorEl);

  // Abre el menú desplegable del usuario desde el botón del header.
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Cierra el menú de usuario sin ejecutar acciones adicionales.
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  // Abre la navegación mobile desde el botón hamburguesa.
  const handleOpenMobileMenu = () => {
    setIsMobileMenuOpen(true);
  };

  // Cierra la navegación mobile.
  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Permite ocultar o mostrar el sidebar en desktop desde el botón hamburguesa.
  const handleToggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen((currentValue) => !currentValue);
  };

  // Cierra la sesión desde el menú del usuario.
  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  const renderBrand = () => (
    <Box sx={styles.sidebarBrand}>
      <Avatar sx={styles.brandAvatar}>
        <SpaOutlinedIcon />
      </Avatar>

      <Box>
        <Typography variant="subtitle1" sx={styles.brandTitle}>
          Green Acres
        </Typography>

        <Typography variant="caption" sx={styles.brandSubtitle}>
          Club Cannábico
        </Typography>
      </Box>
    </Box>
  );

  /*
  Renderiza la navegación por secciones.

  Mantiene la misma lógica de activación por pathname
  y reutiliza el mismo bloque tanto para desktop como para mobile.
  */
  const renderNavigation = (isMobile = false) => (
    <Box sx={styles.navigationSections}>
      {navigationSections.map((section) => (
        <Box key={section.title} sx={styles.navigationSection}>
          <Typography variant="overline" sx={styles.sidebarSectionTitle}>
            {section.title}
          </Typography>

          <List
            disablePadding
            sx={isMobile ? styles.mobileNavigationList : styles.navigationList}
          >
            {section.items.map((item) => {
              const isActive = pathname === item.href;

              return (
                <ListItemButton
                  key={item.href}
                  component={item.disabled ? "button" : "a"}
                  href={item.disabled ? undefined : item.href}
                  disabled={item.disabled}
                  selected={isActive}
                  onClick={isMobile ? handleCloseMobileMenu : undefined}
                  sx={
                    isMobile
                      ? styles.mobileNavigationItem(isActive)
                      : styles.sidebarNavigationItem(isActive)
                  }
                >
                  <Box sx={styles.navigationIcon}>{item.icon}</Box>

                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: styles.navigationText(isActive),
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

  return (
    <Box sx={styles.page}>
      {/* Sidebar desktop permanente, alineado al diseño premium del panel administrativo. */}
      <Box component="aside" sx={styles.desktopSidebar(isDesktopSidebarOpen)}>
        {renderBrand()}

        {renderNavigation()}

        {/* Bloque inferior de usuario. Mantiene las acciones de cuenta existentes. */}
        <Box sx={styles.sidebarUserArea}>
          <Button
            onClick={handleOpenUserMenu}
            aria-label="Abrir menú de usuario"
            aria-controls={isUserMenuOpen ? "admin-user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isUserMenuOpen ? "true" : undefined}
            endIcon={<KeyboardArrowDownIcon />}
            sx={styles.sidebarUserButton}
          >
            <Avatar sx={styles.userAvatar}>AD</Avatar>

            <Box sx={styles.userInfo}>
              <Typography variant="body2" sx={styles.userName}>
                Admin
              </Typography>

              <Typography variant="caption" sx={styles.userEmail}>
                Administrador
              </Typography>
            </Box>
          </Button>
        </Box>
      </Box>

      <Box sx={styles.mainShell(isDesktopSidebarOpen)}>
        <AppBar position="sticky" elevation={0} sx={styles.appBar}>
          <Toolbar disableGutters sx={styles.toolbar}>
            {/* Mobile: abre drawer. Desktop: muestra/oculta sidebar. */}
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

            {/* Header dinámico de cada página administrativa. */}
            <PageHeader title={title} subtitle={subtitle} />

            <Box sx={styles.toolbarSpacer} />

            <Menu
              id="admin-user-menu"
              anchorEl={anchorEl}
              open={isUserMenuOpen}
              onClose={handleCloseUserMenu}
            >
              <MenuItem disabled>Mi perfil</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Contenido dinámico de cada pantalla administrativa. */}
        <Box component="main" sx={styles.content}>
          {children}
        </Box>
      </Box>

      {/* Navegación mobile en drawer lateral para pantallas reducidas. */}
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
        <Box sx={styles.mobileDrawer} role="navigation">
          <Box sx={styles.mobileDrawerHeader}>{renderBrand()}</Box>

          {renderNavigation(true)}
        </Box>
      </Drawer>
    </Box>
  );
}
