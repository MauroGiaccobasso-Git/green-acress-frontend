import { colors } from "@/theme/colors";

/*
Estilos del módulo Stock.

Criterios:
- mobile first;
- identidad visual consistente con Productos, Compras y Ventas;
- layout premium basado en inventario operativo + movimientos recientes;
- uso exclusivo de tokens existentes en src/theme/colors.ts;
- sin exponer datos fuera del DTO real de Stock.
*/

const subtleGreen = "#F3FAF5";
const subtleBlue = "#F3F8FF";
const subtleRed = "#FDEDEC";

/*
Paleta semántica del historial de movimientos.

Los colores representan el efecto de cada operación
sobre el inventario y se reutilizan tanto en el listado
como en la referencia rápida del modal.
*/
const movementSemanticColors = {
  purchase: {
    foreground: "#2E7D32",
    background: "#E8F5E9",
  },
  sale: {
    foreground: "#C62828",
    background: "#FFEBEE",
  },
  reversedSale: {
    foreground: "#1565C0",
    background: "#E3F2FD",
  },
  manualAdjustment: {
    foreground: "#475569",
    background: "#F1F5F9",
  },
  confirmedReservation: {
    foreground: "#6941C6",
    background: "#F1EAFE",
  },
  cancelledReservation: {
    foreground: "#00796B",
    background: "#E0F2F1",
  },
  expiredReservation: {
    foreground: "#ED6C02",
    background: "#FFF4E5",
  },
};

export const stockStyles = {
  root: {
    width: "100%",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(4, minmax(0, 1fr))",
    },
    gap: 1.75,
    mb: 2.5,
  },

  summaryCard: {
    p: "24px 26px",
    minHeight: 132,
    display: "flex",
    alignItems: "center",
    gap: "26px",
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 12px 28px rgba(15, 39, 27, 0.032)",
  },

  summaryIcon: {
    width: 58,
    height: 58,
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    color: colors.brand.primary,
    backgroundColor: subtleGreen,

    "& svg": {
      fontSize: 34,
    },
  },

  summaryIconWarning: {
    color: colors.state.error,
    backgroundColor: subtleRed,
  },

  summaryLabel: {
    fontSize: 13,
    fontWeight: 550,
    color: colors.text.primary,
    lineHeight: 1.25,
  },

  summaryValue: {
    mt: 0.9,
    fontSize: 28,
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: "-0.035em",
    color: colors.text.primary,
  },

  summaryValueWarning: {
    color: colors.state.error,
  },

  summaryHint: {
    mt: 0.9,
    fontSize: 12.5,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.3,
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", xl: "1.75fr 1fr" },
    gap: 2.5,
    alignItems: "start",
  },

  panel: {
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 18px 40px rgba(15, 39, 27, 0.045)",
    overflow: "hidden",
  },

  panelBody: {
    p: { xs: 2, sm: "24px" },
  },

  movementsPanelBody: {
    p: { xs: 2, sm: "24px" },
  },

  panelHeader: {
    display: "flex",
    alignItems: { xs: "stretch", md: "center" },
    justifyContent: "space-between",
    gap: 2.25,
    flexDirection: { xs: "column", md: "row" },
    mb: 2.25,
  },

  panelTitle: {
    fontSize: { xs: 18, sm: 20 },
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: colors.text.primary,
    lineHeight: 1.2,
  },

  panelSubtitle: {
    mt: 0.45,
    fontSize: { xs: 12.5, sm: 13 },
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  toolbar: {
    display: "flex",
    gap: 1,
    alignItems: "center",
    flexDirection: { xs: "column", sm: "row" },
    width: { xs: "100%", md: "auto" },
  },

  searchField: {
    minWidth: { xs: "100%", sm: 330 },
    "& .MuiOutlinedInput-root": {
      height: 46,
      borderRadius: "13px",
      backgroundColor: colors.background.surface,
      fontSize: 14,
      color: colors.text.primary,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },
    "& .MuiInputBase-input": {
      py: 0,
    },
  },

  filterButton: {
    height: 46,
    px: 2.15,
    borderRadius: "13px",
    textTransform: "none",
    fontSize: 14,
    fontWeight: 700,
    color: colors.brand.primary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    width: { xs: "100%", sm: "auto" },
  },

  filtersNotice: {
    mb: 2,
    p: 1.25,
    borderRadius: 3,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
    backgroundColor: subtleBlue,
    border: `1px solid ${colors.border.default}`,
  },

  filtersNoticeText: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.text.secondary,
  },

  tableWrapper: {
    borderRadius: "12px",
    border: `1px solid ${colors.border.default}`,
    overflow: "hidden",
    backgroundColor: colors.background.surface,
    boxShadow: "0 8px 24px rgba(15, 39, 27, 0.018)",
  },

  tableHeader: {
    display: { xs: "none", md: "grid" },
    gridTemplateColumns:
      "minmax(226px, 1.55fr) 0.78fr 0.86fr 0.92fr 1fr 0.68fr minmax(156px, 1.18fr)",
    alignItems: "center",
    columnGap: 2.65,
    px: 2.2,
    py: 1.12,
    borderBottom: `1px solid ${colors.border.default}`,
    color: "rgba(15, 39, 27, 0.68)",
    fontSize: 11.25,
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: "0.055em",
    textTransform: "uppercase",
    backgroundColor: "rgba(15, 39, 27, 0.025)",

    "& span": {
      display: "block",
      whiteSpace: "nowrap",
      textAlign: "left",
    },

    "& span:nth-of-type(7)": {
      textAlign: "center",
    },
  },

  stockRow: {
    minHeight: { md: 100 },
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "minmax(226px, 1.55fr) 0.78fr 0.86fr 0.92fr 1fr 0.68fr minmax(156px, 1.18fr)",
    },
    alignItems: "center",
    columnGap: { xs: 1.5, md: 2.65 },
    rowGap: { xs: 1.25, md: 0 },
    px: { xs: 1.5, md: 2.2 },
    py: { xs: 1.55, md: 1.55 },
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.surface,

    "&:last-of-type": {
      borderBottom: "none",
    },

    "& > div:not(:first-of-type)": {
      justifySelf: { md: "start" },
      textAlign: { md: "left" },
      minWidth: 0,
    },

    "& > div:nth-of-type(7)": {
      width: "100%",
      justifySelf: { md: "stretch" },
      display: "flex",
      justifyContent: { md: "center" },
      alignItems: "center",
      pr: { md: 2 },
    },
  },

  productCell: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    minWidth: 0,
  },

  productImage: {
    width: 60,
    height: 60,
    borderRadius: "9px",
    objectFit: "cover",
    backgroundColor: subtleGreen,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 5px 14px rgba(15, 39, 27, 0.04)",
    flexShrink: 0,
  },

  productPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: "9px",
    display: "grid",
    placeItems: "center",
    backgroundColor: subtleGreen,
    color: colors.brand.primary,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 5px 14px rgba(15, 39, 27, 0.035)",
    flexShrink: 0,

    "& svg": {
      fontSize: 26,
    },
  },

  productName: {
    fontSize: 13.75,
    fontWeight: 650,
    color: colors.text.primary,
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
    wordBreak: "break-word",
  },

  productMeta: {
    mt: 0.45,
    fontSize: 12.25,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.35,
    textTransform: "capitalize",
  },

  mobileStockGrid: {
    display: { xs: "grid", md: "none" },
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 1,
  },

  mobileStockBox: {
    p: 1.15,
    borderRadius: 2.5,
    backgroundColor: subtleGreen,
    border: `1px solid ${colors.border.default}`,
  },

  cellLabelMobile: {
    display: { xs: "block", md: "none" },
    mb: 0.35,
    fontSize: 11.25,
    fontWeight: 700,
    color: "rgba(15, 39, 27, 0.68)",
    textTransform: "uppercase",
    letterSpacing: "0.055em",
  },

  cellValue: {
    fontSize: 13.25,
    fontWeight: 500,
    color: colors.text.primary,
    lineHeight: 1.25,
    letterSpacing: "-0.005em",
  },

  cellValueAvailable: {
    color: colors.brand.primary,
    fontWeight: 620,
  },

  cellValueDanger: {
    color: colors.state.error,
    fontWeight: 620,
  },

  cellSubtext: {
    mt: 0.55,
    fontSize: 11.25,
    fontWeight: 400,
    color: colors.text.muted,
    lineHeight: 1.25,
  },

  statusChip: {
    height: 18,
    minWidth: 44,
    borderRadius: "5px",
    fontWeight: 600,
    fontSize: 10,
    backgroundColor: colors.brand.primaryLight,
    color: colors.state.success,

    "& .MuiChip-label": {
      px: 0.5,
    },
  },

  statusChipInactive: {
    backgroundColor: subtleRed,
    color: colors.state.error,
  },

  adjustButton: {
    minHeight: 29,
    height: 29,
    borderRadius: "8px",
    px: 1,
    fontSize: 11.2,
    textTransform: "none",
    fontWeight: 550,
    color: colors.text.primary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    whiteSpace: "nowrap",
    minWidth: 120,

    justifySelf: "center",
    alignSelf: "center",

    "& .MuiButton-startIcon": {
      marginRight: 0.4,
    },

    "& svg": {
      fontSize: 13.5,
    },

    "&:hover": {
      borderColor: colors.border.strong,
      backgroundColor: colors.background.soft,
    },
  },

  footerRow: {
    mt: 2.7,
    pt: 0.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2.5,
    flexDirection: { xs: "column", sm: "row" },
  },

  footerText: {
    fontSize: 13.2,
    fontWeight: 400,
    color: colors.text.secondary,
  },

  paginationMock: {
    display: "flex",
    gap: 1,
    alignItems: "center",
    pr: 0.25,
  },

  pageButton: {
    minWidth: 35,
    height: 35,
    borderRadius: "8px",
    border: `1px solid ${colors.border.default}`,
    color: colors.text.primary,
    backgroundColor: colors.background.surface,
    fontSize: 12.8,
    fontWeight: 600,
    display: "grid",
    placeItems: "center",
  },

  pageButtonActive: {
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
    boxShadow: "0 8px 18px rgba(47, 111, 70, 0.22)",
  },

  movementsPanel: {
    minHeight: "100%",
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 18px 40px rgba(15, 39, 27, 0.045)",
    overflow: "hidden",
  },

  movementList: {
    borderRadius: "12px",
    border: `1px solid ${colors.border.default}`,
    overflow: "hidden",
    backgroundColor: colors.background.surface,
  },

  /*
  Contenedor scrolleable para el historial completo de movimientos.

  El modal evita paginadores numéricos visibles y usa carga progresiva,
  manteniendo el backend como responsable de entregar páginas acotadas.
  */
  movementModalList: {
    maxHeight: { xs: 430, md: 520 },
    overflowY: "auto",
    borderRadius: "12px",
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.surface,

    "&::-webkit-scrollbar": {
      width: 8,
    },

    "&::-webkit-scrollbar-thumb": {
      borderRadius: 99,
      backgroundColor: "rgba(47, 111, 70, 0.22)",
    },

    "&::-webkit-scrollbar-track": {
      backgroundColor: colors.background.soft,
    },
  },

  /*
  Layout de filtros del modal de historial.

  Se separa en dos filas para mantener claridad visual:
  - búsqueda + tipo de operación;
  - rango de fechas + acciones.
  */
  movementModalFilterRows: {
    display: "grid",
    gap: 1.5,
  },

  movementModalFilterMainRow: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 230px" },
    gap: 1.5,
    alignItems: "center",
  },

  movementModalFilterActionsRow: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
    gap: 1.5,
    alignItems: "center",
  },

  movementModalDateFilters: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 1.5,
    alignItems: "center",
  },

  movementModalFilterButtons: {
    display: "flex",
    justifyContent: { xs: "flex-start", md: "flex-end" },
    alignItems: "center",
    gap: 1.25,
    flexWrap: "wrap",
  },

  loadMoreButton: {
    justifySelf: "center",
    minHeight: 40,
    px: 3,
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 800,
    fontSize: 13.4,
    color: colors.brand.primary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,

    "&:hover": {
      borderColor: colors.brand.primary,
      backgroundColor: subtleGreen,
    },

    "&.Mui-disabled": {
      color: colors.text.secondary,
      borderColor: colors.border.default,
      backgroundColor: colors.background.soft,
    },
  },

  loadMoreFeedback: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1.25,
    py: 1.5,
  },

  refreshingFeedback: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    minHeight: 36,
  },

  movementItem: {
    display: "grid",
    gridTemplateColumns: "44px minmax(0, 1fr) 98px",
    columnGap: 1.85,
    alignItems: "center",
    px: 1.45,
    // Se compacta apenas cada movimiento para que el panel derecho no quede
    // visualmente más bajo que Inventario actual al agrandar el bloque informativo.
    py: 1.35,
    borderBottom: `1px solid ${colors.border.default}`,

    "&:last-of-type": {
      borderBottom: "none",
    },
  },

  movementIcon: {
    width: 42,
    height: 42,
    borderRadius: "8px",
    display: "grid",
    placeItems: "center",
    backgroundColor: subtleGreen,
    color: colors.brand.primary,
    flexShrink: 0,

    "& svg": {
      fontSize: 23,
    },
  },

  /*
  Variantes semánticas reutilizables para el historial.

  Se mantienen centralizadas en styles para evitar
  colores dispersos dentro de componentes visuales.
  */
  movementIconPurchase: {
    backgroundColor: movementSemanticColors.purchase.background,
    color: movementSemanticColors.purchase.foreground,
  },

  movementIconSale: {
    backgroundColor: movementSemanticColors.sale.background,
    color: movementSemanticColors.sale.foreground,
  },

  movementIconReversedSale: {
    backgroundColor: movementSemanticColors.reversedSale.background,
    color: movementSemanticColors.reversedSale.foreground,
  },

  movementIconManualAdjustment: {
    backgroundColor: movementSemanticColors.manualAdjustment.background,
    color: movementSemanticColors.manualAdjustment.foreground,
  },

  movementIconConfirmedReservation: {
    backgroundColor: movementSemanticColors.confirmedReservation.background,
    color: movementSemanticColors.confirmedReservation.foreground,
  },

  movementIconCancelledReservation: {
    backgroundColor: movementSemanticColors.cancelledReservation.background,
    color: movementSemanticColors.cancelledReservation.foreground,
  },

  movementIconExpiredReservation: {
    backgroundColor: movementSemanticColors.expiredReservation.background,
    color: movementSemanticColors.expiredReservation.foreground,
  },

  movementTitle: {
    fontSize: 13.25,
    fontWeight: 650,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  movementProduct: {
    mt: 0.35,
    fontSize: 12.25,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  movementObservation: {
    mt: 0.3,
    fontSize: 12.25,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.4,

    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordBreak: "break-word",
  },

  movementSide: {
    textAlign: "right",
    minWidth: 98,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },

  movementQuantityPositive: {
    fontSize: 13.6,
    fontWeight: 700,
    color: colors.brand.primary,
    lineHeight: 1.2,
  },

  movementQuantityNegative: {
    fontSize: 13.6,
    fontWeight: 700,
    color: colors.state.error,
    lineHeight: 1.2,
  },

  movementDate: {
    mt: 0.7,
    fontSize: 11.8,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.28,
  },

  movementTime: {
    mt: 0.45,
    fontSize: 11.6,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.28,
  },

  viewAllButton: {
    // Menor separación respecto al listado para compensar el nuevo aire del bloque azul
    // sin romper la alineación inferior entre paneles.
    mt: 2.35,
    width: "100%",
    height: 42,
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 700,
    fontSize: 13.5,
    color: colors.text.primary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,

    "&:hover": {
      borderColor: colors.border.strong,
      backgroundColor: colors.background.soft,
    },
  },

  infoBox: {
    // Bloque informativo más premium: baja visualmente respecto al botón,
    // gana altura y respira mejor internamente sin desbalancear el panel.
    mt: 2.55,
    py: 1.45,
    px: 1.65,
    minHeight: 86,
    borderRadius: "12px",
    display: "flex",
    alignItems: "flex-start",
    gap: 1.15,
    backgroundColor: subtleBlue,
    border: "1px solid #D8E7FF",
  },

  infoIcon: {
    mt: 0.15,
    color: "#2563EB",
    flexShrink: 0,
  },

  infoTitle: {
    fontSize: 13.2,
    fontWeight: 750,
    color: "#1D4ED8",
    lineHeight: 1.25,
    mb: 0.9,
  },

  infoText: {
    color: "#3A5B9E",
    mt: 0,
    fontSize: 12.8,
    lineHeight: 1.72,
  },

  /*
  Referencia rápida del significado visual de cada movimiento.

  Se muestra al pie del modal para reducir la carga cognitiva
  del administrador y mantener una lectura consistente entre
  icono, color y efecto sobre el inventario.
  */
  movementQuickReference: {
    mt: 2,
    p: { xs: 1.5, sm: 1.75 },
    borderRadius: "12px",
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  movementQuickReferenceTitle: {
    mb: 1.35,
    fontSize: 12.75,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.25,
  },

  movementQuickReferenceGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      md: "repeat(4, minmax(0, 1fr))",
    },
    gap: 1.1,
  },

  movementQuickReferenceItem: {
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: "36px minmax(0, 1fr)",
    alignItems: "center",
    gap: 1,
  },

  movementQuickReferenceIcon: {
    width: 36,
    height: 36,
    borderRadius: "9px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,

    "& svg": {
      fontSize: 20,
    },
  },

  movementQuickReferenceLabel: {
    fontSize: 11.7,
    fontWeight: 750,
    color: colors.text.primary,
    lineHeight: 1.2,
  },

  movementQuickReferenceHint: {
    mt: 0.25,
    fontSize: 10.8,
    fontWeight: 450,
    color: colors.text.secondary,
    lineHeight: 1.25,
  },

  movementReferencePurchase: {
    backgroundColor: movementSemanticColors.purchase.background,
    color: movementSemanticColors.purchase.foreground,
  },

  movementReferenceSale: {
    backgroundColor: movementSemanticColors.sale.background,
    color: movementSemanticColors.sale.foreground,
  },

  movementReferenceReversedSale: {
    backgroundColor: movementSemanticColors.reversedSale.background,
    color: movementSemanticColors.reversedSale.foreground,
  },

  movementReferenceManualAdjustment: {
    backgroundColor: movementSemanticColors.manualAdjustment.background,
    color: movementSemanticColors.manualAdjustment.foreground,
  },

  movementReferenceConfirmedReservation: {
    backgroundColor: movementSemanticColors.confirmedReservation.background,
    color: movementSemanticColors.confirmedReservation.foreground,
  },

  movementReferenceCancelledReservation: {
    backgroundColor: movementSemanticColors.cancelledReservation.background,
    color: movementSemanticColors.cancelledReservation.foreground,
  },

  movementReferenceExpiredReservation: {
    backgroundColor: movementSemanticColors.expiredReservation.background,
    color: movementSemanticColors.expiredReservation.foreground,
  },

  emptyState: {
    p: 3,
    borderRadius: 3.5,
    textAlign: "center",
    backgroundColor: subtleGreen,
    border: `1px dashed ${colors.border.strong}`,
  },

  emptyTitle: {
    fontWeight: 700,
    color: colors.text.primary,
  },

  emptyText: {
    mt: 0.75,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  errorBox: {
    p: 1.5,
    borderRadius: 3,
    backgroundColor: subtleRed,
    color: colors.state.error,
    fontSize: 13,
    fontWeight: 650,
  },


  /* =========================================================
     MODAL DE FILTROS DE INVENTARIO
  ========================================================= */

  stockFiltersDialogPaper: {
    width: { xs: "calc(100% - 24px)", sm: "100%" },
    maxWidth: 640,
    m: { xs: 1.5, sm: 2 },
    borderRadius: { xs: "18px", sm: "22px" },
    overflow: "hidden",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 28px 70px rgba(15, 39, 27, 0.20)",
  },

  stockFiltersHeader: {
    px: { xs: 2, sm: 3 },
    py: { xs: 2, sm: 2.5 },
    background:
      "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(246,250,247,1) 100%)",
    borderBottom: `1px solid ${colors.border.default}`,
  },

  stockFiltersHeaderContent: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 2,
  },

  stockFiltersTitle: {
    fontSize: { xs: 22, sm: 25 },
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-0.035em",
    color: colors.text.primary,
  },

  stockFiltersSubtitle: {
    mt: 0.7,
    maxWidth: 500,
    fontSize: { xs: 13.5, sm: 14.5 },
    fontWeight: 400,
    lineHeight: 1.45,
    color: colors.text.secondary,
  },

  stockFiltersCloseButton: {
    width: 46,
    height: 46,
    flexShrink: 0,
    color: colors.text.secondary,
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    transition:
      "color 160ms ease, border-color 160ms ease, background-color 160ms ease, transform 160ms ease",

    "&:hover": {
      color: colors.text.primary,
      borderColor: colors.border.strong,
      backgroundColor: colors.background.soft,
      transform: "translateY(-1px)",
    },

    "& svg": { fontSize: 26 },
  },

  stockFiltersContent: {
    px: { xs: 2, sm: 3 },
    pt: { xs: 2.25, sm: 3 },
    pb: { xs: 2.5, sm: 3 },
  },

  stockFiltersInfoCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
    p: { xs: 1.75, sm: 2 },
    borderRadius: "16px",
    color: colors.text.primary,
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  stockFiltersInfoIcon: {
    width: 46,
    height: 46,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "13px",
    color: colors.brand.primary,
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,

    "& svg": { fontSize: 23 },
  },

  stockFiltersInfoContent: {
    minWidth: 0,
    pt: 0.15,
  },

  stockFiltersInfoTitle: {
    fontSize: 14.5,
    fontWeight: 750,
    lineHeight: 1.25,
    color: colors.text.primary,
  },

  stockFiltersInfoText: {
    mt: 0.45,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.48,
    color: colors.text.secondary,
  },

  stockFiltersSectionTitle: {
    mt: 3,
    mb: 1.4,
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.brand.primary,
  },

  stockFiltersFieldsGrid: {
    display: "grid",
    gap: 2.1,
  },

  stockFiltersFieldGroup: {
    minWidth: 0,
  },

  stockFiltersField: {
    "& .MuiOutlinedInput-root": {
      minHeight: 56,
      borderRadius: "14px",
      backgroundColor: colors.background.surface,
      fontSize: 14,
      color: colors.text.primary,
      transition:
        "border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },

    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.strong,
    },

    "& .MuiOutlinedInput-root.Mui-focused": {
      boxShadow: `0 0 0 3px ${colors.background.soft}`,
    },

    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.brand.primary,
      borderWidth: 1.5,
    },

    "& .MuiInputLabel-root": {
      fontSize: 13.5,
      color: colors.text.secondary,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.brand.primary,
    },

    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
    },
  },

  stockFiltersHelperText: {
    mt: 0.8,
    px: 0.15,
    fontSize: 12.5,
    fontWeight: 400,
    lineHeight: 1.42,
    color: colors.text.secondary,
  },

  stockFiltersActions: {
    px: { xs: 2, sm: 3 },
    py: { xs: 1.75, sm: 2 },
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 1.25,
    backgroundColor: colors.background.soft,
    borderTop: `1px solid ${colors.border.default}`,

    "@media (max-width: 599px)": {
      alignItems: "stretch",
      flexDirection: "column",
    },
  },

  stockFiltersPrimaryActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 1,

    "@media (max-width: 599px)": {
      width: "100%",
      "& > button": { flex: 1 },
    },
  },

  stockFiltersClearButton: {
    minHeight: 44,
    px: 2.15,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 700,
    color: colors.text.secondary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,

    "&:hover": {
      color: colors.text.primary,
      borderColor: colors.border.strong,
      backgroundColor: colors.background.surface,
    },

    "&.Mui-disabled": {
      color: colors.text.muted,
      borderColor: colors.border.default,
      backgroundColor: colors.background.soft,
      opacity: 0.72,
    },
  },

  stockFiltersCancelButton: {
    minHeight: 44,
    px: 2,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 700,
    color: colors.text.secondary,

    "&:hover": {
      color: colors.text.primary,
      backgroundColor: colors.background.surface,
    },
  },

  stockFiltersApplyButton: {
    minHeight: 44,
    px: 2.4,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 800,
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    boxShadow: "0 10px 22px rgba(47, 111, 70, 0.20)",

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 12px 24px rgba(47, 111, 70, 0.24)",
    },
  },
};