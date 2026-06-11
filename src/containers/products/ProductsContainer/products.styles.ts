import { alpha, type Theme } from "@mui/material/styles";

import { colors } from "@/theme/colors";

/*
Estilos del módulo administrativo de productos.

Criterios aplicados:
- centralizar estilos visuales del módulo;
- reutilizar colors.ts y theme.ts;
- evitar colores hardcodeados innecesarios;
- mantener diseño responsive y mobile first;
- separar estilos de layout general, ProductCard y modales.
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

  filterButtonActive: {
    minHeight: 42,
    px: 2,
    borderRadius: "5px",
    fontWeight: 600,
    textTransform: "none",
    color: colors.brand.primary,
    borderColor: colors.brand.primary,
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),

    "&:hover": {
      borderColor: colors.brand.primary,
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.12),
    },
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

  /*
  Barra de resumen de filtros activos.

  Permite que el administrador vea rápidamente
  qué filtros están aplicados y los pueda quitar
  sin volver a abrir el panel de filtros.
  */
  activeFiltersBar: {
    display: "flex",
    alignItems: { xs: "flex-start", sm: "center" },
    justifyContent: "space-between",
    flexDirection: { xs: "column", sm: "row" },
    gap: 1.25,
    mt: 1.5,
    p: 1.25,
    borderRadius: "5px",
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.055),
    border: (theme: Theme) =>
      `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
  },

  activeFiltersList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.75,
  },

  activeFilterSummaryChip: {
    height: 30,
    borderRadius: "5px",
    color: colors.brand.primary,
    bgcolor: colors.background.surface,
    border: (theme: Theme) =>
      `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
    fontWeight: 600,

    "& .MuiChip-deleteIcon": {
      color: colors.brand.primary,

      "&:hover": {
        color: colors.brand.primaryDark,
      },
    },
  },

  activeFiltersClearButton: {
    minHeight: 34,
    px: 1.25,
    borderRadius: "5px",
    color: colors.brand.primary,
    fontWeight: 700,
    textTransform: "none",

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
    },
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

  Mantiene una apariencia limpia y profesional,
  alineada con la identidad visual del AdminLayout.
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
        0.01,
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

  /*
  Filtros avanzados.

  Se mantienen estilos compatibles con Popover,
  evitando acoplar el diseño a una única posición
  de pantalla.
  */
  filterPopoverPaper: {
    width: {
      xs: "calc(100vw - 32px)",
      sm: 420,
    },
    borderRadius: "15px",
    bgcolor: colors.background.surface,
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    boxShadow: (theme: Theme) =>
      `0 24px 70px ${alpha(theme.palette.common.black, 0.16)}`,
    overflow: "hidden",
  },

  filterPopover: {
    width: {
      xs: "calc(100vw - 32px)",
      sm: 420,
    },
    borderRadius: "15px",
    bgcolor: colors.background.surface,
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    boxShadow: (theme: Theme) =>
      `0 24px 70px ${alpha(theme.palette.common.black, 0.16)}`,
    overflow: "hidden",
  },

  filterPopoverContent: {
    p: {
      xs: 1.75,
      sm: 2.25,
    },
  },

  filterPopoverHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 2,
    pb: 1.75,
    mb: 1.75,
    borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  },

  filterDialog: {
    borderRadius: "5px",
  },

  filterDialogTitle: {
    color: colors.text.primary,
    fontSize: 19,
    fontWeight: 650,
    letterSpacing: "-0.025em",
    lineHeight: 1.2,
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

  filterSection: {
    display: "grid",
    gap: 1.1,

    "& + &": {
      mt: 2.15,
    },
  },

  filterSectionHeader: {
    display: "grid",
    gap: 0.35,
  },

  filterTitle: {
    color: colors.text.primary,
    fontWeight: 700,
    mb: 0,
  },

  filterSectionHelp: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 1.45,
  },

  modalChipGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.85,
  },

  filterFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
    mt: 2.35,
    pt: 1.75,
    borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  },

  filterClearButton: {
    minHeight: 40,
    px: 1.25,
    borderRadius: "5px",
    color: colors.brand.primary,
    fontWeight: 700,
    textTransform: "none",

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
    },
  },

  filterApplyButton: {
    minHeight: 42,
    px: 2.25,
    borderRadius: "5px",
    fontWeight: 700,
    textTransform: "none",
    boxShadow: (theme: Theme) =>
      `0 8px 18px ${alpha(theme.palette.primary.main, 0.18)}`,
  },

  /*
  Estilos del modal de alta y edición de productos.

  Refinamiento final:
  - preview inmediata del producto;
  - contenido scrolleable;
  - footer visible;
  - menor carga visual;
  - jerarquía premium sin modificar lógica.
  */
  productFormDialog: {
    width: "100%",
    maxHeight: {
      xs: "calc(100vh - 24px)",
      md: "calc(100vh - 48px)",
    },
    borderRadius: "15px",
    bgcolor: colors.background.surface,
    boxShadow: (theme: Theme) =>
      `0 28px 80px ${alpha(theme.palette.common.black, 0.22)}`,
    overflow: "hidden",

    /*
    El formulario interno se comporta como columna flexible
    para que el header y el footer permanezcan visibles
    mientras el contenido central scrollea.
    */
    "& form": {
      display: "flex",
      flexDirection: "column",
      maxHeight: "inherit",
    },
  },

  productFormHeader: {
    display: "flex",
    alignItems: { xs: "flex-start", sm: "center" },
    justifyContent: "space-between",
    flexDirection: { xs: "column", sm: "row" },
    flexShrink: 0,
    gap: 1,
    px: { xs: 2, sm: 3 },
    pt: { xs: 1.75, sm: 2 },
    pb: 1.35,
    borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  },

  productFormTitle: {
    p: 0,
    color: colors.text.primary,
    fontSize: { xs: 22, sm: 24 },
    fontWeight: 700,
    letterSpacing: "-0.035em",
    lineHeight: 1.05,
  },

  productFormSubtitle: {
    mt: 0.55,
    color: colors.text.secondary,
    fontSize: 13.5,
    lineHeight: 1.4,
    maxWidth: 560,
  },

  productFormStatusActiveChip: {
    height: 30,
    borderRadius: "999px",
    color: colors.text.inverse,
    bgcolor: colors.brand.primary,
    fontWeight: 700,
    textTransform: "capitalize",

    "&:hover": {
      bgcolor: colors.brand.primary,
    },
  },

  productFormStatusInactiveChip: {
    height: 30,
    borderRadius: "999px",
    color: colors.text.secondary,
    bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.07),
    fontWeight: 700,
    textTransform: "capitalize",
  },

  productFormContent: {
    flex: 1,
    minHeight: 0,
    px: { xs: 2, sm: 3 },
    py: { xs: 1.5, md: 1.6 },
    overflowY: "auto",

    /*
    En desktop se oculta la barra visual de scroll
    para mantener una apariencia limpia y premium.

    El scroll sigue existiendo si el contenido lo requiere,
    evitando sacrificar accesibilidad o usabilidad.
    */
    scrollbarWidth: {
      xs: "auto",
      md: "none",
    },

    "&::-webkit-scrollbar": {
      display: {
        xs: "block",
        md: "none",
      },
    },
  },

  productFormLayout: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "270px 1fr",
    },
    gap: 2,
    alignItems: "start",
  },

  productFormPreviewCard: {
    position: { md: "sticky" },
    top: { md: 0 },
    overflow: "hidden",
    borderRadius: "15px",
    bgcolor: colors.background.surface,
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    boxShadow: (theme: Theme) =>
      `0 14px 34px ${alpha(theme.palette.common.black, 0.055)}`,
  },

  productFormImageFrame: {
    height: { xs: 165, md: 175 },
    overflow: "hidden",
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
  },

  productFormImage: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
  },

  productFormImageFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.06),
  },

  productFormImageFallbackText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: 600,
  },

  productFormPreviewContent: {
    p: 1.35,
  },

  productFormPreviewLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    mb: 0.65,
  },

  productFormPreviewTitle: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.04em",
    lineHeight: 1.1,

    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",

    overflow: "hidden",
    wordBreak: "break-word",
  },

  productFormPreviewChips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.6,
    mt: 1,
  },

  productFormPreviewChip: {
    height: 25,
    borderRadius: "999px",
    color: colors.brand.primary,
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.08),
    fontWeight: 700,
    textTransform: "capitalize",
  },

  productFormPreviewText: {
    mt: 1.1,
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 1.45,

    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",

    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
  },

  productFormSections: {
    display: "grid",
    gap: 1.45,
  },

  productFormSection: {
    display: "grid",
    gap: 1,
  },

  productFormSectionHeader: {
    display: "grid",
    gap: 0.25,
  },

  productFormSectionTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "-0.015em",
  },

  productFormSectionText: {
    color: colors.text.secondary,
    fontSize: 12.5,
    lineHeight: 1.35,
  },

  productFormGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
    },
    gap: 1.1,
  },

  productFormFullWidth: {
    gridColumn: "1 / -1",
  },

  productFormField: {
    "& .MuiOutlinedInput-root": {
      minHeight: 42,
      borderRadius: "8px",
      bgcolor: colors.background.surface,

      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.35),
      },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderWidth: 1,
        borderColor: colors.brand.primary,
      },
    },

    "& .MuiInputLabel-root": {
      color: colors.text.secondary,
      fontSize: 13,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.brand.primary,
    },

    "& .MuiInputBase-input": {
      color: colors.text.primary,
      fontSize: 15,
    },

    "& .MuiFormHelperText-root": {
      mx: 0,
      color: colors.text.secondary,
      fontSize: 12,
      lineHeight: 1.35,
    },
  },

  productFormReadonlyField: {
    "& .MuiOutlinedInput-root": {
      minHeight: 42,
      borderRadius: "8px",
      bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.035),
    },

    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: colors.text.secondary,
    },

    "& .MuiInputLabel-root": {
      color: colors.text.secondary,
      fontSize: 13,
    },

    "& .MuiFormHelperText-root": {
      mx: 0,
      color: colors.text.secondary,
      fontSize: 12,
      lineHeight: 1.35,
    },
  },

  productFormMetaGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
    },
    gap: 1,
    mb: 0.7,
  },

  productFormReadonlyCard: {
    p: 1.1,
    borderRadius: "12px",
    bgcolor: (theme: Theme) => alpha(theme.palette.text.primary, 0.035),
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  },

  productFormReadonlyLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    mb: 0.4,
  },

  productFormReadonlyValue: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: 700,
    textTransform: "capitalize",
  },

  productFormReadonlyHint: {
    mt: 0.4,
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 1.35,
  },

  productFormDivider: {
    borderColor: (theme: Theme) => theme.palette.divider,
  },

  productFormHelpBox: {
    p: 1.1,
    borderRadius: "12px",
    bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.055),
    border: (theme: Theme) =>
      `1px solid ${alpha(theme.palette.primary.main, 0.14)}`,
  },

  productFormHelpText: {
    color: colors.text.secondary,
    fontSize: 12.5,
    lineHeight: 1.45,
  },

  productFormActions: {
    flexShrink: 0,
    px: { xs: 2, sm: 3 },
    pb: 1.6,
    pt: 1.15,
    gap: 1,
    borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    justifyContent: "flex-end",
    bgcolor: colors.background.surface,
  },

  productFormCancelButton: {
    minHeight: 44,
    px: 2.25,
    borderRadius: "8px",
    color: colors.text.primary,
    fontWeight: 700,
    textTransform: "none",
    borderColor: (theme: Theme) => theme.palette.divider,

    "&:hover": {
      borderColor: (theme: Theme) => alpha(theme.palette.primary.main, 0.35),
      bgcolor: (theme: Theme) => alpha(theme.palette.primary.main, 0.045),
    },

    "&:focus-visible": {
      outline: (theme: Theme) =>
        `3px solid ${alpha(theme.palette.primary.main, 0.28)}`,
      outlineOffset: 2,
    },
  },

  productFormSubmitButton: {
    minHeight: 44,
    px: 2.5,
    borderRadius: "8px",
    fontWeight: 700,
    textTransform: "none",
    boxShadow: (theme: Theme) =>
      `0 10px 22px ${alpha(theme.palette.primary.main, 0.18)}`,

    "&:hover": {
      boxShadow: (theme: Theme) =>
        `0 12px 26px ${alpha(theme.palette.primary.main, 0.24)}`,
    },

    "&:focus-visible": {
      outline: (theme: Theme) =>
        `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
      outlineOffset: 2,
    },
  },
  productFormSubmitSpinner: {
    color: "inherit",
  },

  productFormConfirmDialog: {
    width: "100%",
    maxWidth: 440,
    borderRadius: "15px",
    bgcolor: colors.background.surface,
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    boxShadow: (theme: Theme) =>
      `0 24px 70px ${alpha(theme.palette.common.black, 0.2)}`,
  },

  productFormConfirmTitle: {
    px: { xs: 2.25, sm: 3 },
    pt: { xs: 2.25, sm: 2.6 },
    pb: 0.75,
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
  },

  productFormConfirmContent: {
    px: { xs: 2.25, sm: 3 },
    pt: 0.75,
    pb: 1,
  },

  productFormConfirmText: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 1.55,
  },

  productFormConfirmActions: {
    px: { xs: 2.25, sm: 3 },
    pt: 1,
    pb: { xs: 2.25, sm: 2.6 },
    gap: 1,
    justifyContent: "flex-end",
  },

  productFormDiscardButton: {
    minHeight: 44,
    px: 2.25,
    borderRadius: "8px",
    bgcolor: (theme: Theme) => theme.palette.error.main,
    color: (theme: Theme) => theme.palette.error.contrastText,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: (theme: Theme) =>
      `0 10px 22px ${alpha(theme.palette.error.main, 0.18)}`,

    "&:hover": {
      bgcolor: (theme: Theme) => theme.palette.error.dark,
      boxShadow: (theme: Theme) =>
        `0 12px 26px ${alpha(theme.palette.error.main, 0.24)}`,
    },

    "&:focus-visible": {
      outline: (theme: Theme) =>
        `3px solid ${alpha(theme.palette.error.main, 0.24)}`,
      outlineOffset: 2,
    },
  },

  productFeedbackAlert: {
    width: "100%",
    maxWidth: { xs: "calc(100vw - 32px)", sm: 420 },
    borderRadius: "12px",
    bgcolor: colors.background.surface,
    border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    boxShadow: (theme: Theme) =>
      `0 16px 42px ${alpha(theme.palette.common.black, 0.14)}`,

    "& .MuiAlert-icon": {
      alignItems: "center",
    },

    "& .MuiAlert-message": {
      color: colors.text.primary,
      fontSize: 14,
      fontWeight: 600,
    },
  },
};
