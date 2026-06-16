import { alpha, type Theme } from "@mui/material/styles";

import { colors } from "@/theme/colors";

const SIDEBAR_WIDTH = 222;

export const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    bgcolor: colors.background.app,
  },

  /*
  Sidebar desktop permanente.

  Replica la estructura del layout esperado:
  marca superior, navegación agrupada por secciones
  y usuario anclado al pie.
  */
  desktopSidebar: (isOpen: boolean) => ({
    display: { xs: "none", md: "flex" },
    position: "fixed",
    inset: "0 auto 0 0",
    width: SIDEBAR_WIDTH,
    minHeight: "100vh",
    flexDirection: "column",
    bgcolor: colors.background.surface,
    borderRight: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    zIndex: (theme: Theme) => theme.zIndex.drawer,
    transform: isOpen ? "translateX(0)" : `translateX(-${SIDEBAR_WIDTH}px)`,
    transition: "transform 180ms ease",
  }),

  sidebarBrand: {
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    minHeight: 86,
    px: 2.5,
  },

  /*
  Compatibilidad con versiones previas del layout.
  */
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

  /*
  El peso tipográfico proviene del theme.
  Solamente ajustamos detalles visuales
  específicos del layout.
  */
  brandTitle: {
    color: colors.brand.primaryDark,
    lineHeight: 1,
    fontWeight: 700,
  },

  /*
  Mantiene una jerarquía visual más suave
  debajo del nombre de la aplicación.
  */
  brandSubtitle: {
    display: "block",
    color: colors.text.secondary,
    mt: 0.35,
    fontWeight: 500,
  },

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

  /*
  Compatibilidad con versión anterior del layout.
  */
  desktopNavigation: {
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    gap: 0.5,
  },

  /*
  Compatibilidad con versión anterior del layout.
  */
  navigationButton: (isActive: boolean) => ({
    minHeight: 44,
    px: 2,
    borderRadius: 999,
    color: isActive ? colors.brand.primaryDark : colors.text.primary,
    bgcolor: isActive
      ? (theme: Theme) => alpha(theme.palette.primary.main, 0.09)
      : "transparent",
    fontWeight: 700,
    textTransform: "none",

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
    },

    "&.Mui-disabled": {
      opacity: 0.45,
    },
  }),

  sidebarNavigationItem: (isActive: boolean) => ({
    minHeight: 42,
    px: 1.25,
    borderRadius: 1.5,
    color: isActive ? colors.brand.primaryDark : colors.text.primary,
    bgcolor: isActive
      ? (theme: Theme) => alpha(theme.palette.primary.main, 0.075)
      : "transparent",
    textTransform: "none",

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.055),
    },

    "&.Mui-selected": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.075),
    },

    "&.Mui-selected:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.105),
    },

    "&.Mui-disabled": {
      opacity: 0.65,
      color: colors.text.secondary,
    },

    "& .MuiSvgIcon-root": {
      color: isActive ? colors.brand.primary : colors.text.secondary,
      fontSize: 20,
    },
  }),

  navigationIcon: {
    width: 28,
    minWidth: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mr: 1,
  },

  navigationText: (isActive: boolean) => ({
    color: isActive ? colors.brand.primaryDark : colors.text.primary,
    fontSize: 14,
    fontWeight: isActive ? 700 : 500,
  }),

  /*
  Compatibilidad con versión anterior del drawer mobile.
  */
  mobileNavigationIcon: {
    display: "flex",
    alignItems: "center",
    mr: 1.5,
  },

  /*
  Bloque inferior del usuario.

  Mantiene la acción de logout existente,
  pero visualmente queda como perfil anclado al pie.
  */
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
    borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.055),
    },
  },

  mainShell: (isSidebarOpen: boolean) => ({
    flex: 1,
    minWidth: 0,
    ml: {
      xs: 0,
      md: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
    },
    transition: "margin-left 180ms ease",
  }),

  appBar: {
    bgcolor: colors.background.surface,
    color: colors.text.primary,
    borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  },

  toolbar: {
    minHeight: 70,
    px: { xs: 2, md: 3 },
  },

  mobileMenuButton: {
    display: { xs: "inline-flex", md: "none" },
    width: 44,
    height: 44,
    color: colors.text.primary,
  },

  desktopMenuButton: {
    display: { xs: "none", md: "inline-flex" },
    width: 44,
    height: 44,
    color: colors.text.primary,
  },

  mobileBrand: {
    display: { xs: "flex", md: "none" },
    alignItems: "center",
    gap: 1.25,
    flexShrink: 0,
  },

  toolbarSpacer: {
    flex: 1,
  },

  userButton: {
    display: { xs: "none", md: "inline-flex" },
    minHeight: 48,
    px: 1.25,
    borderRadius: 2,
    color: colors.text.primary,
    textTransform: "none",
    bgcolor: "transparent",

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
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
    textAlign: "left",
    minWidth: 0,
  },

  /*
  Ajustes visuales específicos del
  bloque de información del usuario.
  */
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
    borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,

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
    color: isActive ? colors.brand.primaryDark : colors.text.primary,
    bgcolor: isActive
      ? (theme: Theme) => alpha(theme.palette.primary.main, 0.075)
      : "transparent",

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.055),
    },

    "&.Mui-selected": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.075),
    },

    "&.Mui-disabled": {
      opacity: 0.65,
      color: colors.text.secondary,
    },

    "& .MuiSvgIcon-root": {
      color: isActive ? colors.brand.primary : colors.text.secondary,
      fontSize: 20,
    },
  }),

  /*
  Área donde se renderiza el contenido
  dinámico de cada módulo administrativo.
  */
  content: {
    px: { xs: 2, md: 3, xl: 3.5 },
    py: { xs: 3, md: 3.5 },
  },
} as const;