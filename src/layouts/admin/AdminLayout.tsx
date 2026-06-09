"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
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

import { useAuth } from "@/hooks/auth/useAuth";
import { styles } from "./adminLayout.styles";

type AdminLayoutProps = {
  children: ReactNode;
};

const navigationItems = [
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
    label: "Socios",
    href: "/admin/members",
    disabled: true,
    icon: <GroupOutlinedIcon fontSize="small" />,
  },
  {
    label: "Proveedores",
    href: "/admin/providers",
    disabled: true,
    icon: <LocalShippingOutlinedIcon fontSize="small" />,
  },
  {
    label: "Ventas",
    href: "/admin/sales",
    disabled: true,
    icon: <PointOfSaleOutlinedIcon fontSize="small" />,
  },
  {
    label: "Reservas",
    href: "/admin/reservations",
    disabled: true,
    icon: <EventAvailableOutlinedIcon fontSize="small" />,
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Cierra la sesión desde el menú del usuario.
  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  return (
    <Box sx={styles.page}>
      <AppBar position="static" elevation={0} sx={styles.appBar}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={styles.toolbar}>
            {/* Botón visible solo en mobile para abrir la navegación administrativa. */}
            <IconButton
              onClick={handleOpenMobileMenu}
              aria-label="Abrir navegación administrativa"
              sx={styles.mobileMenuButton}
            >
              <MenuIcon />
            </IconButton>

            {/* Identidad visual del panel administrativo. */}
            <Box sx={styles.brand}>
              <Avatar sx={styles.brandAvatar}>GA</Avatar>

              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 900, lineHeight: 1 }}
                >
                  Green Acres
                </Typography>

                <Typography variant="caption" sx={styles.brandSubtitle}>
                  Panel administrativo
                </Typography>
              </Box>
            </Box>

            {/* Navegación principal del administrador en desktop. */}
            <Box sx={styles.desktopNavigation}>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Button
                    key={item.href}
                    href={item.disabled ? undefined : item.href}
                    disabled={item.disabled}
                    startIcon={item.icon}
                    sx={styles.navigationButton(isActive)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            {/* Menú de usuario con acciones de cuenta. */}
            <Button
              onClick={handleOpenUserMenu}
              aria-label="Abrir menú de usuario"
              aria-controls={isUserMenuOpen ? "admin-user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isUserMenuOpen ? "true" : undefined}
              endIcon={<KeyboardArrowDownIcon />}
              sx={styles.userButton}
            >
              <Avatar sx={styles.userAvatar}>A</Avatar>

              <Box sx={styles.userInfo}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 800, lineHeight: 1.1 }}
                >
                  Administrador
                </Typography>

                <Typography variant="caption" sx={styles.userEmail}>
                  {user?.email}
                </Typography>
              </Box>
            </Button>

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
        </Container>
      </AppBar>

      {/* Navegación mobile en drawer lateral para pantallas reducidas. */}
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
      >
        <Box sx={styles.mobileDrawer} role="navigation">
          <Box sx={styles.mobileDrawerHeader}>
            <Avatar sx={styles.brandAvatar}>GA</Avatar>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Green Acres
              </Typography>

              <Typography variant="caption" sx={styles.mobileDrawerSubtitle}>
                Panel administrativo
              </Typography>
            </Box>
          </Box>

          <List>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <ListItemButton
                  key={item.href}
                  component={item.disabled ? "button" : "a"}
                  href={item.disabled ? undefined : item.href}
                  disabled={item.disabled}
                  selected={isActive}
                  onClick={handleCloseMobileMenu}
                  sx={styles.mobileNavigationItem(isActive)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: 1.5,
                    }}
                  >
                    {item.icon}
                  </Box>

                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Contenido dinámico de cada pantalla administrativa. */}
      <Container maxWidth="xl" sx={styles.content}>
        {children}
      </Container>
    </Box>
  );
}
