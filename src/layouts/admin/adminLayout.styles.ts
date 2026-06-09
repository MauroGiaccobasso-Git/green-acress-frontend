import { colors } from "@/theme/colors";

export const styles = {
  page: {
    minHeight: "100vh",
    bgcolor: colors.background.app,
  },

  appBar: {
    bgcolor: colors.brand.primaryDark,
    color: colors.text.inverse,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  toolbar: {
    minHeight: { xs: 80, md: 96 },
    justifyContent: "space-between",
    gap: { xs: 1.5, md: 3 },
  },

  mobileMenuButton: {
    display: { xs: "inline-flex", md: "none" },
    width: 44,
    height: 44,
    color: colors.text.inverse,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    flexShrink: 0,
  },

  brandAvatar: {
    width: 44,
    height: 44,
    bgcolor: colors.brand.primaryLight,
    color: colors.brand.primaryDark,
    fontWeight: 900,
  },

  /*
  Mantiene una jerarquía visual más suave
  debajo del nombre de la aplicación.
  */
  brandSubtitle: {
    display: { xs: "none", sm: "block" },
    color: "rgba(255,255,255,0.72)",
    mt: 0.5,
  },

  /*
  El peso tipográfico proviene del theme.
  Solamente ajustamos detalles visuales
  específicos del layout.
  */
  brandTitle: {
    color: colors.text.inverse,
    lineHeight: 1,
  },

  desktopNavigation: {
    display: { xs: "none", md: "flex" },
    alignItems: "center",
    gap: 0.5,
  },

  navigationButton: (isActive: boolean) => ({
    minHeight: 44,
    px: 2,
    borderRadius: 999,
    color: isActive
      ? colors.brand.primaryDark
      : "rgba(255,255,255,0.82)",
    bgcolor: isActive ? colors.brand.primaryLight : "transparent",
    fontWeight: 800,
    textTransform: "none",
    "&:hover": {
      bgcolor: isActive
        ? colors.brand.primaryLight
        : "rgba(255,255,255,0.10)",
    },
    "&.Mui-disabled": {
      color: "rgba(255,255,255,0.34)",
    },
  }),

  userButton: {
    minHeight: 48,
    px: { xs: 0.75, sm: 1.25 },
    borderRadius: 999,
    color: colors.text.inverse,
    textTransform: "none",
    bgcolor: "rgba(255,255,255,0.08)",
    "&:hover": {
      bgcolor: "rgba(255,255,255,0.14)",
    },
  },

  userAvatar: {
    width: 32,
    height: 32,
    mr: { xs: 0, sm: 1 },
    bgcolor: colors.background.surface,
    color: colors.brand.primaryDark,
    fontSize: 14,
    fontWeight: 900,
  },

  userInfo: {
    display: { xs: "none", md: "block" },
    textAlign: "left",
  },

  /*
  Ajustes visuales específicos del
  bloque de información del usuario.
  */
  userName: {
    lineHeight: 1.1,
  },

  userEmail: {
    color: "rgba(255,255,255,0.65)",
  },

  mobileDrawer: {
    width: 280,
    minHeight: "100%",
    bgcolor: colors.background.surface,
  },

  mobileDrawerHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    p: 2,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  mobileDrawerSubtitle: {
    display: "none",
  },

  mobileDrawerTitle: {
    color: colors.brand.primaryDark,
    lineHeight: 1,
  },

  mobileNavigationItem: (isActive: boolean) => ({
    minHeight: 48,
    mx: 1,
    my: 0.5,
    borderRadius: 2,
    color: colors.text.primary,
    bgcolor: isActive ? colors.brand.primaryLight : "transparent",
    "&:hover": {
      bgcolor: isActive
        ? colors.brand.primaryLight
        : colors.background.app,
    },
    "&.Mui-selected": {
      bgcolor: colors.brand.primaryLight,
    },
    "&.Mui-disabled": {
      opacity: 0.45,
    },
  }),

  mobileNavigationIcon: {
    display: "flex",
    alignItems: "center",
    mr: 1.5,
  },

  /*
  Área donde se renderiza el contenido
  dinámico de cada módulo administrativo.
  */
  content: {
    py: { xs: 3, md: 4 },
  },
} as const;