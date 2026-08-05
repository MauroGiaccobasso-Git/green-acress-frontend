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

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
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

import { styles } from "./authenticatedLayout.styles";

/* =========================================================
   TIPOS PÚBLICOS
========================================================= */

export type AuthenticatedLayoutNavigationItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

export type AuthenticatedLayoutNavigationSection = {
  title: string;
  items: AuthenticatedLayoutNavigationItem[];
};

export type AuthenticatedLayoutUser = {
  initials: string;
  name: string;
  description: string;
};

export type AuthenticatedLayoutUserMenuItem = {
  id: string;
  label: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
};

/*
Acción opcional ubicada al final del sidebar
desktop y del drawer mobile.

Permite que cada layout autenticado configure
una acción principal sin incorporar reglas
específicas dentro del shell compartido.
*/
export type AuthenticatedLayoutSidebarFooterAction = {
  label: string;
  icon?: ReactNode;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  ariaLabel?: string;
};

export type AuthenticatedLayoutActiveMatcher = (
  pathname: string,
  item: AuthenticatedLayoutNavigationItem,
) => boolean;

/* =========================================================
   PROPS
========================================================= */

type AuthenticatedLayoutProps = {
  children: ReactNode;

  title?: string;
  subtitle?: string;

  brandSubtitle: string;

  navigationSections:
    AuthenticatedLayoutNavigationSection[];

  navigationAriaLabel: string;
  openNavigationAriaLabel: string;
  toggleNavigationAriaLabel: string;

  userMenuId: string;
  userMenuAriaLabel: string;

  user: AuthenticatedLayoutUser;

  userMenuItems:
    AuthenticatedLayoutUserMenuItem[];

  isUserMenuBusy?: boolean;

  /*
  Desktop conserva visible el usuario por defecto
  para mantener intacto el layout administrativo.
  */
  showDesktopUserMenu?: boolean;

  /*
  Mobile conserva el comportamiento anterior:
  el botón de usuario sólo aparece cuando
  el layout consumidor lo habilita.
  */
  showMobileUserMenu?: boolean;

  sidebarFooterAction?:
    AuthenticatedLayoutSidebarFooterAction;

  isNavigationItemActive?:
    AuthenticatedLayoutActiveMatcher;
};

/* =========================================================
   CONTEXTO DE ACCIONES DEL HEADER
========================================================= */

type AuthenticatedLayoutHeaderActionsContextValue = {
  setHeaderActions: (
    actions: ReactNode,
  ) => void;

  clearHeaderActions: () => void;
};

const AuthenticatedLayoutHeaderActionsContext =
  createContext<AuthenticatedLayoutHeaderActionsContextValue | null>(
    null,
  );

export function useAuthenticatedLayoutHeaderActions() {
  const context = useContext(
    AuthenticatedLayoutHeaderActionsContext,
  );

  if (!context) {
    throw new Error(
      "useAuthenticatedLayoutHeaderActions debe utilizarse dentro de AuthenticatedLayout.",
    );
  }

  return context;
}

/* =========================================================
   LAYOUT AUTENTICADO COMPARTIDO
========================================================= */

/*
Shell visual compartido por los layouts autenticados.

Centraliza:

- sidebar desktop;
- drawer mobile;
- navegación;
- header;
- acciones contextuales;
- identidad del usuario;
- menú del usuario;
- acción inferior opcional;
- contenido principal.

No conoce roles, autenticación, consentimiento,
reglas del negocio ni rutas específicas.
*/
export function AuthenticatedLayout({
  children,
  title,
  subtitle,
  brandSubtitle,
  navigationSections,
  navigationAriaLabel,
  openNavigationAriaLabel,
  toggleNavigationAriaLabel,
  userMenuId,
  userMenuAriaLabel,
  user,
  userMenuItems,
  isUserMenuBusy = false,
  showDesktopUserMenu = true,
  showMobileUserMenu = false,
  sidebarFooterAction,
  isNavigationItemActive,
}: AuthenticatedLayoutProps) {
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);

  const [
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  const [
    isDesktopSidebarOpen,
    setIsDesktopSidebarOpen,
  ] = useState(true);

  const [
    headerActions,
    setHeaderActionsState,
  ] = useState<ReactNode>(null);

  const isUserMenuOpen =
    Boolean(anchorEl);

  /* =========================================================
     ACCIONES DEL HEADER
  ========================================================= */

  const setHeaderActions = useCallback(
    (actions: ReactNode) => {
      setHeaderActionsState(() => actions);
    },
    [],
  );

  const clearHeaderActions =
    useCallback(() => {
      setHeaderActionsState(null);
    }, []);

  const headerActionsContextValue =
    useMemo<AuthenticatedLayoutHeaderActionsContextValue>(
      () => ({
        setHeaderActions,
        clearHeaderActions,
      }),
      [
        clearHeaderActions,
        setHeaderActions,
      ],
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

  const handleUserMenuItemClick = (
    item: AuthenticatedLayoutUserMenuItem,
  ) => {
    handleCloseUserMenu();
    handleCloseMobileMenu();

    if (item.onClick) {
      void item.onClick();
    }
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

  const handleToggleDesktopSidebar =
    () => {
      setIsDesktopSidebarOpen(
        (currentValue) =>
          !currentValue,
      );
    };

  /* =========================================================
     ACCIÓN INFERIOR
  ========================================================= */

  const handleSidebarFooterActionClick =
    () => {
      if (
        !sidebarFooterAction ||
        sidebarFooterAction.disabled
      ) {
        return;
      }

      handleCloseUserMenu();
      handleCloseMobileMenu();

      void sidebarFooterAction.onClick();
    };

  /* =========================================================
     HELPERS
  ========================================================= */

  const resolveNavigationItemActive = (
    item: AuthenticatedLayoutNavigationItem,
  ) => {
    if (isNavigationItemActive) {
      return isNavigationItemActive(
        pathname,
        item,
      );
    }

    return pathname === item.href;
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
          {brandSubtitle}
        </Typography>
      </Box>
    </Box>
  );

  const renderNavigation = (
    isMobile = false,
  ) => (
    <Box
      component="nav"
      aria-label={navigationAriaLabel}
      sx={styles.navigationSections}
    >
      {navigationSections.map(
        (section) => (
          <Box
            key={section.title}
            sx={styles.navigationSection}
          >
            <Typography
              variant="overline"
              sx={
                styles.sidebarSectionTitle
              }
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
              {section.items.map(
                (item) => {
                  const isActive =
                    resolveNavigationItemActive(
                      item,
                    );

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
                      <Box
                        sx={
                          styles.navigationIcon
                        }
                      >
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
                },
              )}
            </List>
          </Box>
        ),
      )}
    </Box>
  );

  const renderUserButton = () => (
    <Button
      type="button"
      onClick={handleOpenUserMenu}
      disabled={isUserMenuBusy}
      aria-label={userMenuAriaLabel}
      aria-controls={
        isUserMenuOpen
          ? userMenuId
          : undefined
      }
      aria-haspopup="true"
      aria-expanded={
        isUserMenuOpen
          ? "true"
          : undefined
      }
      endIcon={
        <KeyboardArrowDownIcon />
      }
      sx={styles.sidebarUserButton}
    >
      <Avatar sx={styles.userAvatar}>
        {user.initials}
      </Avatar>

      <Box sx={styles.userInfo}>
        <Typography
          variant="body2"
          sx={styles.userName}
        >
          {user.name}
        </Typography>

        <Typography
          variant="caption"
          sx={styles.userEmail}
        >
          {user.description}
        </Typography>
      </Box>
    </Button>
  );

  const renderSidebarFooterAction =
    () => {
      if (!sidebarFooterAction) {
        return null;
      }

      return (
        <Box
          sx={
            styles.sidebarFooterActionArea
          }
        >
          <Button
            type="button"
            startIcon={
              sidebarFooterAction.icon
            }
            onClick={
              handleSidebarFooterActionClick
            }
            disabled={
              sidebarFooterAction.disabled
            }
            aria-label={
              sidebarFooterAction.ariaLabel ??
              sidebarFooterAction.label
            }
            sx={
              styles.sidebarFooterAction
            }
          >
            {sidebarFooterAction.label}
          </Button>
        </Box>
      );
    };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <AuthenticatedLayoutHeaderActionsContext.Provider
      value={
        headerActionsContextValue
      }
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

          {renderSidebarFooterAction()}

          {showDesktopUserMenu ? (
            <Box
              sx={
                styles.sidebarUserArea
              }
            >
              {renderUserButton()}
            </Box>
          ) : null}
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
                type="button"
                onClick={
                  handleOpenMobileMenu
                }
                aria-label={
                  openNavigationAriaLabel
                }
                sx={
                  styles.mobileMenuButton
                }
              >
                <MenuIcon />
              </IconButton>

              <IconButton
                type="button"
                onClick={
                  handleToggleDesktopSidebar
                }
                aria-label={
                  toggleNavigationAriaLabel
                }
                sx={
                  styles.desktopMenuButton
                }
              >
                <MenuIcon />
              </IconButton>

              <PageHeader
                title={title}
                subtitle={subtitle}
              />

              <Box
                sx={
                  styles.toolbarSpacer
                }
              />

              {headerActions ? (
                <Box
                  sx={
                    styles.headerActions
                  }
                >
                  {headerActions}
                </Box>
              ) : null}

              <Menu
                id={userMenuId}
                anchorEl={anchorEl}
                open={isUserMenuOpen}
                onClose={
                  handleCloseUserMenu
                }
              >
                {userMenuItems.map(
                  (item) => (
                    <MenuItem
                      key={item.id}
                      onClick={() =>
                        handleUserMenuItemClick(
                          item,
                        )
                      }
                      disabled={
                        item.disabled ||
                        isUserMenuBusy
                      }
                    >
                      {item.label}
                    </MenuItem>
                  ),
                )}
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
          onClose={
            handleCloseMobileMenu
          }
          slotProps={{
            paper: {
              sx: styles.mobileDrawerPaper,
            },
          }}
        >
          <Box
            sx={styles.mobileDrawer}
            role="presentation"
          >
            <Box
              sx={
                styles.mobileDrawerHeader
              }
            >
              {renderBrand()}
            </Box>

            {renderNavigation(true)}

            {renderSidebarFooterAction()}

            {showMobileUserMenu ? (
              <Box
                sx={
                  styles.sidebarUserArea
                }
              >
                {renderUserButton()}
              </Box>
            ) : null}
          </Box>
        </Drawer>
      </Box>
    </AuthenticatedLayoutHeaderActionsContext.Provider>
  );
}