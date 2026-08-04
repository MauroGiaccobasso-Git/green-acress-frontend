import { alpha, type Theme } from "@mui/material/styles";

import { colors } from "@/theme/colors";

const SIDEBAR_WIDTH = 222;
const HEADER_HEIGHT = 78;

export const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    bgcolor: colors.background.app,
  },

  /* =========================================================
     SIDEBAR DESKTOP
  ========================================================= */

  desktopSidebar: (isOpen: boolean) => ({
    display: {
      xs: "none",
      md: "flex",
    },
    position: "fixed",
    inset: "0 auto 0 0",
    width: SIDEBAR_WIDTH,
    minHeight: "100vh",
    flexDirection: "column",
    bgcolor: colors.background.surface,
    borderRight: (theme: Theme) =>
      `1px solid ${theme.palette.divider}`,
    zIndex: (theme: Theme) => theme.zIndex.drawer,
    transform: isOpen
      ? "translateX(0)"
      : `translateX(-${SIDEBAR_WIDTH}px)`,
    transition: "transform 180ms ease",
  }),

  sidebarBrand: {
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    minHeight: 86,
    px: 2.5,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    flexShrink: 0,
  },

  brandAvatar: {
    width: 46,
    height: 46,
    bgcolor: "transparent",
    color: colors.brand.primary,
    fontWeight: 700,

    "& .MuiSvgIcon-root": {
      fontSize: 36,
    },
  },

  brandTitle: {
    color: colors.brand.primaryDark,
    lineHeight: 1,
    fontWeight: 700,
  },

  brandSubtitle: {
    display: "block",
    mt: 0.35,
    color: colors.text.secondary,
    fontWeight: 500,
  },

  /* =========================================================
     NAVEGACIÓN
  ========================================================= */

  navigationSections: {
    display: "grid",
    gap: 2,
    px: 1.5,
    pt: 1,
  },

  navigationSection: {
    display: "grid",
    gap: 0.5,
  },

  sidebarSection: {
    px: 1.5,
    py: 2,
  },

  sidebarSectionTitle: {
    display: "block",
    px: 1.25,
    color: colors.text.secondary,
    fontWeight: 700,
    letterSpacing: "0.08em",
    fontSize: 11,
  },

  navigationList: {
    display: "grid",
    gap: 0.25,
    p: 0,
  },

  desktopNavigation: {
    display: {
      xs: "none",
      md: "flex",
    },
    alignItems: "center",
    gap: 0.5,
  },

  navigationButton: (isActive: boolean) => ({
    minHeight: 44,
    px: 2,
    borderRadius: 999,
    color: isActive
      ? colors.brand.primaryDark
      : colors.text.primary,
    bgcolor: isActive
      ? (theme: Theme) =>
          alpha(theme.palette.primary.main, 0.09)
      : "transparent",
    fontWeight: 700,
    textTransform: "none",

    "&:hover": {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, 0.06),
    },

    "&.Mui-disabled": {
      opacity: 0.45,
    },
  }),

  sidebarNavigationItem: (isActive: boolean) => ({
    minHeight: 42,
    px: 1.25,
    borderRadius: 1.5,
    color: isActive
      ? colors.brand.primaryDark
      : colors.text.primary,
    bgcolor: isActive
      ? (theme: Theme) =>
          alpha(theme.palette.primary.main, 0.075)
      : "transparent",
    textTransform: "none",

    "&:hover": {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, 0.055),
    },

    "&.Mui-selected": {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, 0.075),
    },

    "&.Mui-selected:hover": {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, 0.105),
    },

    "&.Mui-disabled": {
      opacity: 0.65,
      color: colors.text.secondary,
    },

    "& .MuiSvgIcon-root": {
      color: isActive
        ? colors.brand.primary
        : colors.text.secondary,
      fontSize: 20,
    },
  }),

  navigationIcon: {
    width: 28,
    minWidth: 28,
    height: 28,
    mr: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  navigationText: (isActive: boolean) => ({
    color: isActive
      ? colors.brand.primaryDark
      : colors.text.primary,
    fontSize: 14,
    fontWeight: isActive ? 700 : 500,
  }),

  mobileNavigationIcon: {
    display: "flex",
    alignItems: "center",
    mr: 1.5,
  },

  /* =========================================================
     USUARIO DEL SIDEBAR
  ========================================================= */

  sidebarUserArea: {
    mt: "auto",
    p: 1.5,
  },

  sidebarUserButton: {
    width: "100%",
    minHeight: 62,
    px: 1.25,
    borderRadius: 1.5,
    justifyContent: "flex-start",
    color: colors.text.primary,
    textTransform: "none",
    borderTop: (theme: Theme) =>
      `1px solid ${theme.palette.divider}`,

    "&:hover": {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, 0.055),
    },
  },

  userAvatar: {
    width: 36,
    height: 36,
    mr: 1,
    bgcolor: colors.brand.primaryLight,
    color: colors.brand.primaryDark,
    fontSize: 14,
    fontWeight: 800,
  },

  userInfo: {
    display: "block",
    minWidth: 0,
    textAlign: "left",
  },

  userName: {
    color: colors.text.primary,
    lineHeight: 1.1,
    fontWeight: 700,
  },

  userEmail: {
    display: "block",
    color: colors.text.secondary,
    fontWeight: 500,
  },

  /* =========================================================
     CONTENEDOR PRINCIPAL
  ========================================================= */

  mainShell: (isSidebarOpen: boolean) => ({
    flex: 1,
    minWidth: 0,
    ml: {
      xs: 0,
      md: isSidebarOpen
        ? `${SIDEBAR_WIDTH}px`
        : 0,
    },
    transition: "margin-left 180ms ease",
  }),

  /* =========================================================
     HEADER ADMINISTRATIVO
  ========================================================= */

  appBar: {
    bgcolor: colors.background.surface,
    color: colors.text.primary,
    borderBottom: (theme: Theme) =>
      `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
  },

  /*
  La referencia Premium utiliza un header cercano
  a los 78 px de altura.

  La altura adicional mejora la jerarquía del título
  y permite integrar correctamente el chip de actualización.
  */
  toolbar: {
    width: "100%",
    minHeight: {
      xs: 70,
      md: HEADER_HEIGHT,
    },
    px: {
      xs: 2,
      md: 3,
      xl: 3.5,
    },
    display: "flex",
    alignItems: "center",
    gap: {
      xs: 0.5,
      md: 0.75,
    },

    /*
    MUI aplica alturas internas al Toolbar según breakpoint.
    Esta regla garantiza que la altura Premium se conserve.
    */
    "@media (min-width: 0px)": {
      minHeight: {
        xs: 70,
        md: HEADER_HEIGHT,
      },
    },
  },

  mobileMenuButton: {
    display: {
      xs: "inline-flex",
      md: "none",
    },
    width: 44,
    height: 44,
    mr: 0.5,
    flexShrink: 0,
    color: colors.text.primary,
  },

  desktopMenuButton: {
    display: {
      xs: "none",
      md: "inline-flex",
    },
    width: 44,
    height: 44,
    mr: 0.75,
    flexShrink: 0,
    color: colors.text.primary,
  },

  mobileBrand: {
    display: {
      xs: "flex",
      md: "none",
    },
    alignItems: "center",
    gap: 1.25,
    flexShrink: 0,
  },

  toolbarSpacer: {
    flex: 1,
    minWidth: {
      xs: 0,
      md: 2,
    },
  },

  /*
  Slot destinado a acciones contextuales del encabezado.

  En el Dashboard contendrá el indicador:
  "Actualizado: hoy, 19:05".

  Se oculta en pantallas pequeñas para no comprimir
  el título ni interferir con el botón del menú.
  */
  headerActions: {
    display: {
      xs: "none",
      sm: "flex",
    },
    alignItems: "center",
    justifyContent: "flex-end",
    flexShrink: 0,
    ml: {
      sm: 1.5,
      md: 2,
    },
  },

  userButton: {
    display: {
      xs: "none",
      md: "inline-flex",
    },
    minHeight: 48,
    px: 1.25,
    borderRadius: 2,
    color: colors.text.primary,
    textTransform: "none",
    bgcolor: "transparent",

    "&:hover": {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, 0.06),
    },
  },

  /* =========================================================
     DRAWER MOBILE
  ========================================================= */

  mobileDrawerPaper: {
    borderRight: "none",
  },

  mobileDrawer: {
    width: 280,
    minHeight: "100%",
    bgcolor: colors.background.surface,
  },

  mobileDrawerHeader: {
    p: 0,
    borderBottom: (theme: Theme) =>
      `1px solid ${theme.palette.divider}`,

    "& > div": {
      width: "100%",
    },
  },

  mobileDrawerTitle: {
    color: colors.brand.primaryDark,
    lineHeight: 1,
    fontWeight: 700,
  },

  mobileDrawerSubtitle: {
    display: "block",
    color: colors.text.secondary,
  },

  mobileNavigationList: {
    display: "grid",
    gap: 0.25,
    p: 0,
  },

  mobileNavigationItem: (isActive: boolean) => ({
    minHeight: 42,
    px: 1.25,
    borderRadius: 1.5,
    color: isActive
      ? colors.brand.primaryDark
      : colors.text.primary,
    bgcolor: isActive
      ? (theme: Theme) =>
          alpha(theme.palette.primary.main, 0.075)
      : "transparent",

    "&:hover": {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, 0.055),
    },

    "&.Mui-selected": {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, 0.075),
    },

    "&.Mui-disabled": {
      opacity: 0.65,
      color: colors.text.secondary,
    },

    "& .MuiSvgIcon-root": {
      color: isActive
        ? colors.brand.primary
        : colors.text.secondary,
      fontSize: 20,
    },
  }),

  /* =========================================================
     CONTENIDO DE LAS PÁGINAS
  ========================================================= */

  /*
  La franja vacía actual no proviene únicamente de este padding:
  también existe una barra de metadata dentro del Dashboard.

  Aun así, ajustamos el espacio para que, una vez movido el chip
  al header, las KPI queden a unos 24 px del encabezado.
  */
  content: {
    width: "100%",
    minWidth: 0,
    px: {
      xs: 2,
      md: 3,
      xl: 3.5,
    },
    pt: {
      xs: 2,
      md: 3,
    },
    pb: {
      xs: 3,
      md: 3.5,
    },
  },
} as const;