import { alpha, type Theme } from "@mui/material/styles";

import { colors } from "@/theme/colors";

/*
Estilos del módulo administrativo de productos.

Criterios aplicados:
- centralizar estilos visuales del módulo;
- reutilizar colors.ts y theme.ts;
- evitar colores hardcodeados innecesarios;
- mantener diseño responsive y mobile first;
- separar estilos de layout general y ProductCard.
*/
export const productsStyles = {
  page: {
    minHeight: "100vh",
    bgcolor: colors.background.app,
    py: {
      xs: 3,
      md: 4,
    },
  },

  panel: {
    p: {
      xs: 2.5,
      sm: 3,
      md: 4,
    },
    borderRadius: {
      xs: 4,
      md: 5,
    },
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    bgcolor: colors.background.surface,
  },

  header: {
    display: "flex",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    alignItems: {
      xs: "flex-start",
      md: "center",
    },
    justifyContent: "space-between",
    gap: 3,
    mb: 3,
  },

  eyebrow: {
    color: colors.brand.primary,
    fontWeight: 800,
    letterSpacing: "0.14em",
  },

  title: {
    color: colors.brand.primaryDark,
    fontWeight: 900,
    mb: 1,
    letterSpacing: "-0.04em",
  },

  subtitle: {
    color: colors.text.secondary,
    maxWidth: 720,
    lineHeight: 1.7,
  },

  createButton: {
    minHeight: 46,
    px: 3.5,
    borderRadius: 999,
    whiteSpace: "nowrap",
    fontWeight: 800,
  },

  searchRow: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr auto",
    },
    gap: 2,
    alignItems: "flex-start",
    mb: 2,
  },

  filterButton: {
    minHeight: 40,
    px: 3.5,
    borderRadius: 999,
    whiteSpace: "nowrap",
    fontWeight: 800,
  },

  quickFilters: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
    mb: 2.5,
  },

  filterChip: {
    height: 34,
    px: 0.5,
    fontWeight: 700,
    textTransform: "capitalize",
    borderRadius: 999,
    bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.035),
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
    },
  },

  activeFilterChip: {
    height: 34,
    px: 0.5,
    fontWeight: 900,
    textTransform: "capitalize",
    borderRadius: 999,
    color: colors.text.inverse,
    bgcolor: colors.brand.primary,

    "&:hover": {
      bgcolor: colors.brand.primaryDark,
    },
  },

  summaryCard: {
    width: "fit-content",
    minWidth: 180,
    px: 2,
    py: 1.4,
    mb: 4,
    borderRadius: 999,
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.035),
  },

  summaryLabel: {
    color: colors.text.secondary,
    display: "block",
    fontWeight: 700,
    lineHeight: 1,
  },

  summaryValue: {
    color: colors.brand.primaryDark,
    fontWeight: 900,
    lineHeight: 1.1,
  },

  loadingState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    py: 6,
  },

  feedbackText: {
    color: colors.text.secondary,
  },

  alert: {
    borderRadius: 3,
    mb: 3,
  },

  emptyState: {
    py: 7,
    px: 3,
    textAlign: "center",
    borderRadius: 4,
    border: (theme: Theme) => `1px dashed ${theme.palette.divider}`,
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.03),
  },

  emptyTitle: {
    color: colors.brand.primaryDark,
    fontWeight: 800,
    mb: 1,
  },

  /*
  Grilla principal del catálogo.

  Se mantiene mobile first:
  - 1 columna en mobile/tablet;
  - 2 columnas en desktop;
  - 3 columnas en pantallas amplias.
  */
  productGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1fr 1fr",
      xl: "repeat(3, 1fr)",
    },
    gap: {
      xs: 2,
      md: 2.5,
    },
    alignItems: "stretch",
  },

  /*
  Card premium de producto.
  Diseño inspirado en productos modernos:
  imagen protagonista, contenido limpio
  y métricas compactas.
  */
  productCard: {
    overflow: "hidden",
    borderRadius: 5,
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    bgcolor: colors.background.surface,
    boxShadow: "none",
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",

    "&:hover": {
      transform: "translateY(-4px)",
      borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.32),
      boxShadow: (theme: Theme) => theme.shadows[5],
    },
  },

  productImageWrapper: {
    position: "relative",
    height: {
      xs: 180,
      sm: 210,
    },
    overflow: "hidden",
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
  },

  productImage: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    transform: "scale(1.01)",
  },

  imageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.02) 42%, rgba(0,0,0,0.35) 100%)",
    pointerEvents: "none",
  },

  productImageFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
  },

  productImageText: {
    color: colors.text.secondary,
    fontWeight: 800,
  },

  activeStatusChip: {
    position: "absolute",
    top: 14,
    right: 14,
    height: 30,
    px: 0.75,
    fontWeight: 900,
    textTransform: "capitalize",
    color: colors.text.inverse,
    bgcolor: colors.brand.primary,
    border: (theme: Theme) =>
      `1px solid ${alpha(theme.palette.common.white, 0.55)}`,

    "&:hover": {
      bgcolor: colors.brand.primary,
    },
  },

  inactiveStatusChip: {
    position: "absolute",
    top: 14,
    right: 14,
    height: 30,
    px: 0.75,
    fontWeight: 900,
    textTransform: "capitalize",
    color: colors.text.primary,
    bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.86),
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.92),
    },
  },

  productCardContent: {
    p: {
      xs: 2,
      sm: 2.5,
    },

    "&:last-child": {
      pb: {
        xs: 2,
        sm: 2.5,
      },
    },
  },

  productCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
    mb: 1.5,
  },

  productName: {
    color: colors.brand.primaryDark,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
    mb: 0.75,
  },

  productDescription: {
    color: colors.text.secondary,
    lineHeight: 1.55,
    minHeight: 44,
  },

  productChipGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.75,
    mt: 2,
    mb: 2,
  },

  productInfoChip: {
    height: 28,
    fontWeight: 800,
    textTransform: "capitalize",
    borderRadius: 999,
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.07),
  },

  productDivider: {
    my: 2,
  },

  productStatsGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr 1fr",
      sm: "repeat(4, 1fr)",
      md: "1fr 1fr",
      lg: "repeat(4, 1fr)",
      xl: "1fr 1fr",
    },
    gap: 1,
  },

  productStat: {
    minHeight: 78,
    p: 1.4,
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.035),
  },

  productStatLabel: {
    color: colors.text.secondary,
    display: "block",
    fontWeight: 800,
    mb: 0.5,
  },

  productStatValue: {
    color: colors.text.primary,
    fontWeight: 900,
    lineHeight: 1.25,
  },

  productAvailableStat: {
    minHeight: 78,
    p: 1.4,
    borderRadius: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    bgcolor: (theme: Theme) => alpha(theme.palette.success.main, 0.1),
    border: (theme: Theme) =>
      `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
  },

  productLowStock: {
    bgcolor: (theme: Theme) => alpha(theme.palette.warning.main, 0.13),
    border: (theme: Theme) =>
      `1px solid ${alpha(theme.palette.warning.main, 0.32)}`,
  },

  productEmptyStock: {
    bgcolor: (theme: Theme) => alpha(theme.palette.error.main, 0.11),
    border: (theme: Theme) =>
      `1px solid ${alpha(theme.palette.error.main, 0.28)}`,
  },

  productAvailableLabel: {
    color: colors.text.secondary,
    display: "block",
    fontWeight: 900,
    mb: 0.5,
  },

  productAvailableValue: {
    color: colors.brand.primaryDark,
    fontWeight: 950,
    lineHeight: 1.15,
  },

  filterModalContent: {
    display: "grid",
    gap: 3,
    pt: 1,
  },

  filterTitle: {
    color: colors.brand.primaryDark,
    fontWeight: 900,
    mb: 1,
  },

  modalChipGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
  },
};