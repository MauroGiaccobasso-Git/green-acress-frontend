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
  },

  panel: {
    bgcolor: "transparent",
    boxShadow: "none",
  },

  header: {
    display: "flex",
    alignItems: { xs: "flex-start", md: "center" },
    justifyContent: "space-between",
    gap: 2,
    mb: 2.5,
  },

  headerContent: {
    minWidth: 0,
  },

  eyebrow: {
    display: "none",
  },

  title: {
    color: colors.text.primary,
    fontSize: { xs: 28, md: 32 },
    fontWeight: 650,
    letterSpacing: "-0.035em",
    lineHeight: 1.1,
    mb: 0.75,
  },

  subtitle: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: 400,
  },

  createButton: {
    minHeight: 42,
    px: 2.25,
    borderRadius: "5px",
    fontWeight: 600,
    textTransform: "none",
    boxShadow: (theme: Theme) =>
      `0 8px 18px ${alpha(theme.palette.primary.main, 0.18)}`,
  },

  toolbar: {
    mb: 2.5,
  },

  searchRow: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "1fr auto",
    },
    gap: 1.5,
    alignItems: "center",
    p: 1.5,
    borderRadius: "5px",
    bgcolor: colors.background.surface,
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  },

  filterButton: {
    minHeight: 42,
    px: 2,
    borderRadius: "5px",
    fontWeight: 600,
    textTransform: "none",
  },

  resultsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    mt: 2,
  },

  viewToggleGroup: {
    display: { xs: "none", sm: "flex" },
    alignItems: "center",
    gap: 0.75,
  },

  activeViewToggle: {
    width: 36,
    height: 36,
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.brand.primary,
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
  },

  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.secondary,
  },

  quickFilters: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
    mt: 2,
  },

  filterChip: {
    height: 32,
    px: 0.5,
    borderRadius: "5px",
    fontWeight: 500,
    bgcolor: colors.background.surface,
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
    },
  },

  activeFilterChip: {
    height: 32,
    px: 0.5,
    borderRadius: "5px",
    fontWeight: 600,
    color: colors.text.inverse,
    bgcolor: colors.brand.primary,

    "&:hover": {
      bgcolor: colors.brand.primaryDark,
    },
  },

  summaryCard: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    width: "fit-content",
    bgcolor: "transparent",
  },

  summaryLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: 400,
  },

  summaryValue: {
    minWidth: 32,
    height: 32,
    px: 1,
    borderRadius: "5px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.brand.primary,
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.1),
    fontWeight: 600,
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
    borderRadius: "5px",
    mb: 3,
  },

  emptyState: {
    py: 7,
    px: 3,
    textAlign: "center",
    borderRadius: "5px",
    border: (theme: Theme) => `1px dashed ${theme.palette.divider}`,
    bgcolor: colors.background.surface,
  },

  emptyTitle: {
    color: colors.text.primary,
    fontWeight: 600,
    mb: 1,
  },

  clearFiltersButton: {
    mt: 2,
    fontWeight: 600,
    borderRadius: "5px",
    textTransform: "none",
  },

  /*
  Grilla principal del catálogo.
  */
  productGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "repeat(2, 1fr)",
      xl: "repeat(3, 1fr)",
    },
    gap: 2.5,
    alignItems: "stretch",
  },

  /*
  Card premium de producto.

  Se reduce el radio a 5px para acercarse a la referencia visual,
  manteniendo una apariencia limpia y profesional.
  */
  productCard: {
    overflow: "hidden",
    borderRadius: "15px",
    bgcolor: colors.background.surface,
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",

    "&:hover": {
      transform: "translateY(-3px)",
      borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.25),
      boxShadow: (theme: Theme) =>
        `0 16px 32px ${alpha(theme.palette.common.black, 0.07)}`,
    },
  },

  productImageWrapper: {
    position: "relative",
    height: {
      xs: 170,
      md: 184,
    },
    overflow: "hidden",
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
  },

  productImage: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
  },

  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: (theme: Theme) =>
      `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.04)} 0%, ${alpha(
        theme.palette.common.black,
        0.01
      )} 55%, ${alpha(theme.palette.common.black, 0.22)} 100%)`,
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
    fontWeight: 500,
  },

  activeStatusChip: {
    position: "absolute",
    top: 12,
    left: 12,
    height: 28,
    px: 0.75,
    borderRadius: "5px",
    color: colors.text.inverse,
    bgcolor: colors.brand.primary,
    fontWeight: 600,
    textTransform: "capitalize",
    border: (theme: Theme) =>
      `1px solid ${alpha(theme.palette.common.white, 0.35)}`,

    "&:hover": {
      bgcolor: colors.brand.primary,
    },
  },

  inactiveStatusChip: {
    position: "absolute",
    top: 12,
    left: 12,
    height: 28,
    px: 0.75,
    borderRadius: "5px",
    color: colors.text.primary,
    bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.92),
    fontWeight: 600,
    textTransform: "capitalize",
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  },

  editProductButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 40,
    height: 40,
    borderRadius: "100px",
    color: colors.text.primary,
    bgcolor: (theme: Theme) => alpha(theme.palette.background.paper, 0.92),
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    backdropFilter: "blur(10px)",

    "&:hover": {
      bgcolor: colors.background.surface,
      transform: "translateY(-1px)",
    },

    "&:focus-visible": {
      outline: (theme: Theme) =>
        `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
      outlineOffset: 2,
    },
  },

  productCardContent: {
    p: 2.15,

    "&:last-child": {
      pb: 2.15,
    },
  },

  productCardHeader: {
    display: "none",
  },

  productTitleGroup: {
    minWidth: 0,
  },

  productTitleRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "start",
    gap: 1,
    minWidth: 0,
    mb: 1,
  },

  productHeaderChips: {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  productName: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },

  productGeneticsChip: {
    height: 24,
    borderRadius: "5px",
    fontWeight: 500,
    color: colors.brand.primary,
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.09),
    textTransform: "capitalize",
  },

  productActiveChip: {
    height: 24,
    borderRadius: "5px",
    fontWeight: 500,
    color: colors.text.inverse,
    bgcolor: colors.brand.primary,
    textTransform: "capitalize",

    "&:hover": {
      bgcolor: colors.brand.primary,
    },
  },

  productInactiveChip: {
    height: 24,
    borderRadius: "5px",
    fontWeight: 500,
    color: colors.text.secondary,
    bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.06),
    textTransform: "capitalize",
  },

  productDescription: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.55,
    minHeight: 44,
  },

  productChipGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.8,
    mt: 2,
    mb: 2,
  },

  productInfoChip: {
    height: 28,
    borderRadius: "5px",
    fontWeight: 500,
    bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.055),
    textTransform: "capitalize",
  },

  productDivider: {
    my: 2,
  },

  productStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 0,
  },

  productStat: {
    minHeight: 72,
    py: 1.25,
    pr: 1.5,
    borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,

    "&:nth-of-type(odd)": {
      borderRight: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    },

    "&:nth-of-type(even)": {
      pl: 1.5,
    },
  },

  productStatLabel: {
    display: "block",
    color: colors.text.secondary,
    fontWeight: 400,
    mb: 0.5,
  },

  productStatValue: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: 600,
    lineHeight: 1.25,
  },

  productAvailableStat: {
    minHeight: 72,
    py: 1.25,
    pl: 1.5,
  },

  productLowStock: {
    color: (theme: Theme) => theme.palette.warning.main,
  },

  productEmptyStock: {
    color: (theme: Theme) => theme.palette.error.main,
  },

  productAvailableLabel: {
    display: "block",
    color: colors.text.secondary,
    fontWeight: 400,
    mb: 0.5,
  },

  productAvailableValue: {
    color: colors.brand.primary,
    fontSize: 17,
    fontWeight: 650,
    lineHeight: 1.15,
  },

  filterDialog: {
    borderRadius: "5px",
  },

  filterDialogTitle: {
    fontWeight: 600,
    color: colors.text.primary,
    pb: 1,
  },

  filterDialogActions: {
    px: 3,
    pb: 3,
    pt: 1,
    justifyContent: "space-between",
  },

  filterModalContent: {
    display: "grid",
    gap: 3,
    pt: 1,
  },

  filterTitle: {
    color: colors.text.primary,
    fontWeight: 600,
    mb: 1,
  },

  modalChipGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
  },
};