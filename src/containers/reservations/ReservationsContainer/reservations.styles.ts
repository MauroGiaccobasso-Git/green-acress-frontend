import { colors } from "@/theme/colors";

/*
Estilos del módulo administrativo de Reservas.

Referencias utilizadas:
- Stock como estándar arquitectónico y visual;
- Sales como referencia para panel contextual y acciones;
- mockup aprobado como definición UX/UI definitiva.

Criterios:
- mobile first;
- layout Master / Detail;
- cinco KPI operativos;
- tabla seleccionable sin columna de acciones;
- panel lateral contextual;
- uso de tokens globales del Design System;
- estados loading, empty, no-results y error;
- sin modificar AdminLayout ni Sidebar.
*/

const panelShadow = "0 18px 40px rgba(15, 39, 27, 0.045)";

const cardShadow = "0 12px 28px rgba(15, 39, 27, 0.032)";

const subtlePurple = "#F1EAFE";
const purple = "#6941C6";

const subtleOrange = "#FFF4E5";
const orange = "#ED6C02";

const subtleGreen = "#E8F5E9";
const green = "#2E7D32";

const subtleTeal = "#E0F2F1";
const teal = "#00796B";

const subtleRed = "#FFEBEE";
const red = "#C62828";

const subtleBlue = "#F3F8FF";

/*
Columnas compartidas por el encabezado y las filas
de la tabla administrativa.

Centralizar esta definición evita desalineaciones
entre títulos y contenido.
*/
const reservationsTableColumns =
  "minmax(82px, 0.55fr) minmax(160px, 1.18fr) minmax(112px, 0.82fr) minmax(112px, 0.82fr) minmax(102px, 0.72fr) minmax(176px, 1.3fr) minmax(94px, 0.68fr)";

export const reservationsStyles = {
  /* =========================================================
     ESTRUCTURA GENERAL
  ========================================================= */

  root: {
    width: "100%",
  },

  pageContent: {
    display: "flex",
    flexDirection: "column",
    gap: 2.5,
  },

  /* =========================================================
     KPI
  ========================================================= */

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(5, minmax(0, 1fr))",
    },
    gap: 1.75,
  },

  summaryCard: {
    minHeight: 126,
    p: {
      xs: 2,
      md: "22px 20px",
    },
    display: "flex",
    alignItems: "center",
    gap: 2,
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: cardShadow,
  },

  summaryIcon: {
    width: 54,
    height: 54,
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,

    "& svg": {
      fontSize: 31,
    },
  },

  summaryIconConfirmed: {
    color: purple,
    backgroundColor: subtlePurple,
  },

  summaryIconExpiring: {
    color: orange,
    backgroundColor: subtleOrange,
  },

  summaryIconCompleted: {
    color: green,
    backgroundColor: subtleGreen,
  },

  summaryIconCancelled: {
    color: teal,
    backgroundColor: subtleTeal,
  },

  summaryIconExpired: {
    color: red,
    backgroundColor: subtleRed,
  },

  summaryContent: {
    minWidth: 0,
  },

  summaryLabel: {
    fontSize: 12.5,
    fontWeight: 600,
    color: colors.text.secondary,
    lineHeight: 1.25,
  },

  summaryValue: {
    mt: 0.8,
    fontSize: 27,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "-0.035em",
    color: colors.text.primary,
  },

  summaryHint: {
    mt: 0.8,
    fontSize: 11.5,
    fontWeight: 400,
    color: colors.text.muted,
    lineHeight: 1.25,
  },

  /* =========================================================
     PANEL PRINCIPAL
  ========================================================= */

  panel: {
    backgroundColor: "transparent",
    border: "none",
    boxShadow: "none",
    overflow: "visible",
  },

  panelBody: {
    p: 0,
  },

  panelHeader: {
    display: "flex",
    alignItems: {
      xs: "stretch",
      lg: "center",
    },
    justifyContent: "space-between",
    gap: 2,
    flexDirection: {
      xs: "column",
      lg: "row",
    },
    mb: 2.25,
  },

  panelTitle: {
    fontSize: {
      xs: 20,
      sm: 22,
    },
    fontWeight: 800,
    letterSpacing: "-0.035em",
    color: colors.text.primary,
    lineHeight: 1.1,
  },

  panelSubtitle: {
    mt: 0.75,
    fontSize: 14,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.35,
  },

  /* =========================================================
     TOOLBAR Y FILTROS VISIBLES
  ========================================================= */

  toolbar: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr auto",
      lg: "minmax(260px, 1.2fr) auto",
    },
    gap: 1,
    alignItems: "center",
    width: {
      xs: "100%",
      lg: "auto",
    },
  },

  searchField: {
    minWidth: {
      xs: "100%",
      lg: 320,
    },

    "& .MuiOutlinedInput-root": {
      height: 46,
      borderRadius: "13px",
      backgroundColor: colors.background.surface,
      fontSize: 14,
      color: colors.text.primary,
      transition:
        "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
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

    "& .MuiInputBase-input": {
      py: 0,
    },

    "& .MuiInputBase-input::placeholder": {
      color: colors.text.muted,
      opacity: 1,
    },

    "& .MuiInputAdornment-root svg": {
      fontSize: 20,
      color: colors.text.secondary,
      transition: "color 160ms ease",
    },

    "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root svg": {
      color: colors.brand.primary,
    },
  },

  filterButton: {
    height: 46,
    px: 2.35,
    borderRadius: "13px",
    textTransform: "none",
    fontSize: 14,
    fontWeight: 700,
    color: colors.brand.primary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    whiteSpace: "nowrap",
    transition:
      "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",

    "& svg": {
      fontSize: 20,
      transition: "color 160ms ease",
    },

    "&:hover": {
      borderColor: colors.brand.primary,
      backgroundColor: colors.background.soft,
      boxShadow: `0 0 0 3px ${colors.background.soft}`,
    },
  },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "minmax(180px, 0.8fr) minmax(170px, 0.72fr) minmax(170px, 0.72fr) auto",
    },
    gap: 1.25,
    alignItems: "center",
    mb: 2.25,
  },

  filterField: {
    width: "100%",

    "& .MuiOutlinedInput-root": {
      minHeight: 46,
      borderRadius: "13px",
      backgroundColor: colors.background.surface,
      fontSize: 13.5,
      color: colors.text.primary,
      transition:
        "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
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
      fontSize: 13,
      fontWeight: 500,
      color: colors.text.secondary,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.brand.primary,
    },

    "& .MuiSelect-select": {
      display: "flex",
      alignItems: "center",
    },

    "& .MuiSelect-icon": {
      color: colors.text.secondary,
      transition: "color 160ms ease",
    },

    "& .MuiOutlinedInput-root.Mui-focused .MuiSelect-icon": {
      color: colors.brand.primary,
    },

    "& input[type='date']": {
      color: colors.text.primary,
    },

    "& input[type='date']::-webkit-calendar-picker-indicator": {
      cursor: "pointer",
      opacity: 0.72,
      transition: "opacity 160ms ease",
    },

    "& input[type='date']:hover::-webkit-calendar-picker-indicator": {
      opacity: 1,
    },
  },

  filtersNotice: {
    mb: 2,
    p: 1.25,
    borderRadius: 3,
    display: "flex",
    alignItems: {
      xs: "stretch",
      sm: "center",
    },
    justifyContent: "space-between",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    gap: 1,
    backgroundColor: subtleBlue,
    border: `1px solid ${colors.border.default}`,
  },

  filtersNoticeText: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.text.secondary,
  },

  clearFiltersButton: {
    textTransform: "none",
    fontSize: 12.5,
    fontWeight: 700,
    color: colors.brand.primary,
    alignSelf: {
      xs: "flex-start",
      sm: "center",
    },
  },

  /* =========================================================
     MASTER / DETAIL
  ========================================================= */

  masterDetailGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      xl: "minmax(0, 2.25fr) minmax(320px, 0.88fr)",
    },
    gap: 2.25,
    alignItems: "start",
  },

  masterPanel: {
    minWidth: 0,
    height: "100%",
    p: {
      xs: 2,
      md: 2.25,
    },
    display: "flex",
    flexDirection: "column",
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  detailPanel: {
    minWidth: 0,
    height: "100%",
    display: "flex",

    "& > *": {
      width: "100%",
      height: "100%",
    },
  },

  /* =========================================================
     TABLA
  ========================================================= */

  tableWrapper: {
    overflow: "hidden",
    borderRadius: "13px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 8px 24px rgba(15, 39, 27, 0.025)",
  },

  tableHeader: {
    display: {
      xs: "none",
      md: "grid",
    },
    gridTemplateColumns: reservationsTableColumns,
    alignItems: "center",
    columnGap: 2,
    minHeight: 42,
    px: 2,
    py: 1.35,
    color: colors.text.primary,
    backgroundColor: colors.background.soft,
    borderBottom: `1px solid ${colors.border.default}`,
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: "0.005em",

    "& span": {
      display: "block",
      minWidth: 0,
      whiteSpace: "nowrap",
      textAlign: "left",
    },

    "& span:last-of-type": {
      textAlign: "right",
    },
  },

  reservationRow: {
    width: "100%",
    minHeight: {
      md: 92,
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: reservationsTableColumns,
    },
    alignItems: "center",
    columnGap: {
      xs: 1.5,
      md: 2,
    },
    rowGap: {
      xs: 1.25,
      md: 0,
    },
    px: {
      xs: 1.5,
      md: 2,
    },
    py: {
      xs: 1.55,
      md: 1.45,
    },
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.surface,
    cursor: "pointer",
    transition: "background-color 160ms ease, box-shadow 160ms ease",

    "&:last-of-type": {
      borderBottom: "none",
    },

    "&:hover": {
      backgroundColor: colors.background.soft,
    },

    "&:focus-visible": {
      outline: `2px solid ${colors.brand.primary}`,
      outlineOffset: -2,
    },

    "& > div": {
      minWidth: 0,
    },

    "& > div:last-of-type": {
      textAlign: {
        md: "right",
      },
    },
  },

  reservationRowSelected: {
    backgroundColor: subtleGreen,
    boxShadow: `inset 4px 0 0 ${colors.brand.primary}`,

    "&:hover": {
      backgroundColor: subtleGreen,
      boxShadow: `inset 4px 0 0 ${colors.brand.primary}`,
      transform: "none",
    },
  },
  codeCell: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },

  reservationCode: {
    fontSize: 13.5,
    fontWeight: 800,
    color: colors.brand.primary,
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
  },

  memberCell: {
    minWidth: 0,
  },

  memberName: {
    fontSize: 13.8,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.25,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  memberDocument: {
    mt: 0.2,
    fontSize: 11,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.3,
  },

  dateValue: {
    fontSize: 13.2,
    fontWeight: 500,
    color: colors.text.primary,
    lineHeight: 1.25,
  },

  dateSecondary: {
    mt: 0.35,
    fontSize: 11.5,
    fontWeight: 400,
    color: colors.text.muted,
  },

  productList: {
    display: "flex",
    flexDirection: "column",
    gap: 0.35,
    minWidth: 0,
  },

  productName: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.text.primary,
    lineHeight: 1.25,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  productMore: {
    fontSize: 11.5,
    fontWeight: 500,
    color: colors.text.secondary,
  },

  gramsValue: {
    fontSize: 13.8,
    fontWeight: 800,
    color: colors.text.primary,
    whiteSpace: "nowrap",
  },

  cellLabelMobile: {
    display: {
      xs: "block",
      md: "none",
    },
    mb: 0.35,
    fontSize: 10.5,
    fontWeight: 800,
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  mobileRowGrid: {
    display: {
      xs: "grid",
      md: "contents",
    },
    gridTemplateColumns: {
      xs: "repeat(2, minmax(0, 1fr))",
    },
    gap: 1,
  },

  mobileCellBox: {
    p: 1.1,
    borderRadius: 2.5,
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  /* =========================================================
     CHIPS DE ESTADO
  ========================================================= */

  statusChip: {
    height: 24,
    borderRadius: "7px",
    fontSize: 10.5,
    fontWeight: 700,

    "& .MuiChip-label": {
      px: 0.9,
    },
  },

  statusConfirmed: {
    color: purple,
    backgroundColor: subtlePurple,
  },

  statusCompleted: {
    color: green,
    backgroundColor: subtleGreen,
  },

  statusCancelled: {
    color: teal,
    backgroundColor: subtleTeal,
  },

  statusExpired: {
    color: red,
    backgroundColor: subtleRed,
  },

  statusRejected: {
    color: colors.text.secondary,
    backgroundColor: "#F1F5F9",
  },

  /* =========================================================
     PAGINACIÓN
  ========================================================= */

  footerRow: {
    mt: 2.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    flexDirection: {
      xs: "column",
      sm: "row",
    },
  },

  footerText: {
    fontSize: 13,
    fontWeight: 400,
    color: colors.text.secondary,
  },

  pagination: {
    "& .MuiPaginationItem-root": {
      minWidth: 35,
      height: 35,
      borderRadius: "8px",
      border: `1px solid ${colors.border.default}`,
      color: colors.text.primary,
      backgroundColor: colors.background.surface,
      fontSize: 12.5,
      fontWeight: 600,
    },

    "& .MuiPaginationItem-root.Mui-selected": {
      color: colors.text.inverse,
      backgroundColor: colors.brand.primary,
      borderColor: colors.brand.primary,
      boxShadow: "0 8px 18px rgba(47, 111, 70, 0.22)",
    },

    "& .MuiPaginationItem-root.Mui-selected:hover": {
      backgroundColor: colors.brand.primaryDark,
    },
  },

  /* =========================================================
     PANEL DE DETALLE
  ========================================================= */

  detailCard: {
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
    overflow: "hidden",
    height: "100%",
  },

  detailHeader: {
    px: {
      xs: 1.75,
      md: 2,
    },
    py: {
      xs: 1.4,
      md: 1.55,
    },
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 1.25,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  detailHeaderContent: {
    minWidth: 0,
  },

  detailEyebrow: {
    fontSize: 17,
    fontWeight: 800,
    color: colors.text.primary,
    lineHeight: 1.2,
  },

  detailCode: {
    mt: 1.6,
    fontSize: 20,
    fontWeight: 800,
    color: colors.text.primary,
    letterSpacing: "-0.02em",
    lineHeight: 1,
  },

  detailDate: {
    mt: 1,
    fontSize: 12,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.35,
  },

  detailBody: {
    p: {
      xs: 1.5,
      md: 1.75,
    },
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
  },

  detailSection: {
    display: "flex",
    flexDirection: "column",
    gap: 0.75,
  },

  detailSectionTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: colors.text.primary,
    letterSpacing: "-0.01em",
  },

  memberCard: {
    overflow: "hidden",
    borderRadius: "14px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
  },

  memberIdentity: {
    minHeight: 86,
    display: "flex",
    alignItems: "center",
    gap: 1.75,
    px: 1.75,
    py: 1.5,
    backgroundColor: colors.background.soft,
  },

  memberAvatar: {
    width: 56,
    height: 56,
    flexShrink: 0,
    fontSize: 17,
    fontWeight: 800,
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    boxShadow: "0 8px 18px rgba(47, 111, 70, 0.18)",
  },

  memberIdentityContent: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  memberNamePrimary: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.2,
    letterSpacing: "-0.015em",
  },
  memberDocumentPrimary: {
    mt: 0.45,
    fontSize: 11.5,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.25,
  },

  memberCardDivider: {
    borderColor: colors.border.default,
  },

  memberContactList: {
    display: "flex",
    flexDirection: "column",
    px: 1.5,
    py: 0.8,
  },

  memberContactRow: {
    minWidth: 0,
    minHeight: 42,
    display: "grid",
    gridTemplateColumns: "30px 104px minmax(0, 1fr)",
    alignItems: "center",
    gap: 1.15,
    py: 0.8,

    "& + &": {
      borderTop: `1px solid ${colors.border.default}`,
    },
  },

  memberContactIcon: {
    width: 30,
    height: 30,
    display: "grid",
    placeItems: "center",
    borderRadius: "10px",
    color: colors.brand.primary,
    backgroundColor: colors.brand.primaryLight,
    border: `1px solid ${colors.border.default}`,

    "& svg": {
      fontSize: 16,
    },
  },

  memberContactLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.text.secondary,
    letterSpacing: "0.005em",
    lineHeight: 1.2,
  },

  memberContactValue: {
    minWidth: 0,
    fontSize: 12,
    fontWeight: 600,
    color: colors.text.primary,
    lineHeight: 1.3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  detailDivider: {
    my: 0.25,
    borderColor: colors.border.default,
  },

  /* =========================================================
     ESTADO, PLAZO Y PRODUCTOS RESERVADOS
  ========================================================= */

  reservationStatusCard: {
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  reservationStatusSummary: {
    minHeight: 48,
    px: 1.5,
    py: 1,
    display: "grid",
    gridTemplateColumns: "auto auto minmax(0, 1fr)",
    alignItems: "center",
    columnGap: 0.9,
  },

  reservationStatusTitle: {
    fontSize: 12.5,
    fontWeight: 800,
    color: colors.text.primary,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  },
  reservationStatusDescription: {
    minWidth: 0,
    fontSize: 11.8,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.35,
  },

  reservationStatusDivider: {
    borderColor: colors.border.default,
  },

  reservationTimingGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(3, minmax(0, 1fr))",
      xl: "repeat(3, minmax(0, 1fr))",
    },
  },

  reservationTimingItem: {
    minWidth: 0,
    px: 1.5,
    py: 1.45,

    "& + &": {
      borderTop: {
        xs: `1px solid ${colors.border.default}`,
        sm: "none",
      },
      borderLeft: {
        xs: "none",
        sm: `1px solid ${colors.border.default}`,
      },
    },
  },

  reservationTimingLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: colors.text.muted,
    lineHeight: 1.2,
    mb: 0.45,
  },

  reservationTimingValue: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.3,
    wordBreak: "break-word",
  },
  reservationTimingRemaining: {
    display: "flex",
    alignItems: "center",
    gap: 0.6,
    mt: 0.35,
  },

  reservationTimingRemainingIcon: {
    fontSize: 18,
    color: colors.state.warning,
  },

  reservationTimingRemainingValue: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.state.warning,
    lineHeight: 1,
  },

  reservedProductsTable: {
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
  },

  reservedProductsHeader: {
    display: {
      xs: "none",
      sm: "grid",
    },
    gridTemplateColumns: "minmax(0, 1fr) 78px 104px",
    alignItems: "center",
    columnGap: 1.25,
    px: 1.35,
    py: 1.1,
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.soft,

    "& .MuiTypography-root": {
      fontSize: 11,
      fontWeight: 800,
      color: colors.text.secondary,
      lineHeight: 1.2,
    },

    "& .MuiTypography-root:not(:first-of-type)": {
      textAlign: "right",
    },
  },

  reservedProductsBody: {
    display: "flex",
    flexDirection: "column",
    py: 0.35,
  },

  reservedProductRow: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "minmax(0, 1fr) 78px 104px",
    },
    alignItems: "center",
    columnGap: 1.25,
    rowGap: {
      xs: 1,
      sm: 0,
    },
    px: 1.35,
    py: 1.15,

    backgroundColor: colors.background.surface,
    borderRadius: "8px",
    transition: "background-color 150ms ease",

    "&:hover": {
      backgroundColor: colors.background.soft,
    },

    "& + &": {
      borderTop: `1px solid ${colors.border.default}`,
    },
  },

  reservedProductIdentity: {
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: "46px minmax(0, 1fr)",
    alignItems: "center",
    gap: 1.15,
  },

  reservedProductThumbnail: {
    width: 36,
    height: 36,
    flexShrink: 0,
    objectFit: "cover",

    borderRadius: "10px",

    border: `1px solid ${colors.border.default}`,

    backgroundColor: colors.background.surface,

    boxShadow: "0 2px 6px rgba(16, 41, 28, 0.08)",
  },

  reservedProductThumbnailFallback: {
    width: 46,
    height: 46,
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,

    "& svg": {
      fontSize: 21,
      color: colors.brand.primary,
    },
  },

  reservedProductInformation: {
    minWidth: 0,
  },

  reservedProductName: {
    fontSize: 12.5,
    fontWeight: 800,
    color: colors.text.primary,
    lineHeight: 1.25,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  reservedProductMeta: {
    mt: 0.4,
    fontSize: 10.75,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.3,
  },

  reservedProductMetric: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: {
      xs: "space-between",
      sm: "flex-end",
    },
    gap: 1,
  },

  reservedProductMobileLabel: {
    display: {
      xs: "block",
      sm: "none",
    },
    fontSize: 10.25,
    fontWeight: 500,
    color: colors.text.muted,
    lineHeight: 1.25,
  },

  reservedProductQuantity: {
    fontSize: 12.5,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.2,
    textAlign: "right",
    whiteSpace: "nowrap",
  },

  reservedProductBlockedQuantity: {
    fontSize: 12.5,
    fontWeight: 800,
    color: colors.brand.primary,
    lineHeight: 1.2,
    textAlign: "right",
    whiteSpace: "nowrap",
  },

  reservedProductsTotal: {
    px: 1.35,
    py: 1.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
    borderTop: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.soft,
  },

  reservedProductsTotalLabel: {
    fontSize: 11.8,
    fontWeight: 700,
    color: colors.text.secondary,
    lineHeight: 1.2,
  },

  reservedProductsTotalValue: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.brand.primary,
    lineHeight: 1,
    whiteSpace: "nowrap",
  },

  /* =========================================================
   HISTORIAL
========================================================= */

  historyList: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 1.8,

    "&::before": {
      content: '""',
      position: "absolute",
      top: 8,
      bottom: 8,
      left: 4.15,
      width: "1px",
      backgroundColor: colors.background.soft,
    },
  },

  historyItem: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "20px minmax(0, 1fr)",
    columnGap: 1.25,
    alignItems: "start",

    /*
  Separa sutilmente los eventos sin convertirlos
  en tarjetas independientes.
  */
    "&:not(:last-of-type) > div:last-of-type": {
      pb: 1.2,
      borderBottom: `1px solid ${colors.border.default}`,
    },
  },

  historyIndicator: {
    position: "relative",
    zIndex: 2,
    width: 8,
    height: 8,
    mt: 0.55,
    ml: 0.15,
    borderRadius: "50%",
    backgroundColor: colors.brand.primary,
    border: `2px solid ${colors.background.surface}`,
    boxShadow: `0 0 0 3px ${colors.brand.primaryLight}`,
  },

  historyIndicatorPending: {
    backgroundColor: colors.state.warning,
  },

  historyIndicatorConfirmed: {
    backgroundColor: colors.state.success,
  },

  historyIndicatorCompleted: {
    backgroundColor: colors.state.success,
  },

  historyIndicatorCancelled: {
    backgroundColor: colors.border.strong,
  },

  historyIndicatorExpired: {
    backgroundColor: colors.state.error,
  },

  historyIndicatorRejected: {
    backgroundColor: colors.state.error,
  },

  historyContent: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },

  historyHeader: {
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    alignItems: "baseline",
    columnGap: 1.5,
  },

  historyState: {
    minWidth: 0,
    fontSize: 12.5,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
    whiteSpace: "nowrap",
  },

  historyStatePending: {
    color: colors.state.warning,
  },

  historyStateConfirmed: {
    color: colors.state.success,
  },

  historyStateCompleted: {
    color: colors.state.success,
  },

  historyStateCancelled: {
    color: colors.border.strong,
  },

  historyStateExpired: {
    color: colors.state.error,
  },

  historyStateRejected: {
    color: colors.state.error,
  },

  historyMeta: {
    minWidth: 0,
    fontSize: 10.5,
    fontWeight: 400,
    color: colors.text.muted,
    lineHeight: 1.4,
    textAlign: "right",
    overflowWrap: "anywhere",
  },

  historyObservation: {
    mt: 0.85,
    pl: 0.15,
    fontSize: 11.4,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.55,
    overflowWrap: "anywhere",
  },
  /* =========================================================
     ACCIONES
  ========================================================= */

  actionsSection: {
    display: "grid",
    gap: 1.1,
    mt: 0.55,
  },

  cancelButton: {
    minHeight: 46,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 700,
    color: colors.state.error,
    borderColor: colors.border.strong,
    backgroundColor: colors.background.surface,
    transition:
      "background-color 160ms ease, border-color 160ms ease, color 160ms ease, opacity 160ms ease",

    "& svg": {
      fontSize: 18,
    },

    "&:hover": {
      color: colors.state.error,
      borderColor: colors.state.error,
      backgroundColor: subtleRed,
    },

    "&.Mui-disabled": {
      color: colors.state.disabled,
      borderColor: colors.border.default,
      backgroundColor: colors.background.soft,
      opacity: 0.78,
    },
  },

  withdrawalButton: {
    minHeight: 46,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 800,
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    boxShadow: "0 10px 22px rgba(47, 111, 70, 0.22)",
    transition:
      "background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease, opacity 160ms ease",

    "& svg": {
      fontSize: 18,
    },

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 12px 26px rgba(47, 111, 70, 0.26)",
      transform: "translateY(-1px)",
    },

    "&:active": {
      transform: "translateY(0)",
    },

    "&.Mui-disabled": {
      color: colors.text.inverse,
      backgroundColor: colors.state.disabled,
      boxShadow: "none",
      opacity: 0.78,
    },
  },

  readonlyNotice: {
    p: 1.4,
    borderRadius: "12px",
    fontSize: 12.5,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.4,
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  actionDialogPaper: {
    overflow: "hidden",
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  actionDialogTitle: {
    px: {
      xs: 2,
      sm: 3,
    },
    pt: {
      xs: 2.25,
      sm: 3,
    },
    pb: {
      xs: 1.5,
      sm: 1.75,
    },
  },

  actionDialogTitleContent: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
  },
  actionDialogIcon: {
    width: 46,
    height: 46,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "14px",
    border: `1px solid ${colors.border.default}`,

    "& svg": {
      fontSize: 24,
    },
  },

  actionDialogIconDanger: {
    color: colors.state.error,
    backgroundColor: subtleRed,
  },

  actionDialogIconSuccess: {
    color: colors.state.success,
    backgroundColor: colors.brand.primaryLight,
  },

  actionDialogTitleText: {
    fontSize: {
      xs: 18,
      sm: 19,
    },
    fontWeight: 800,
    color: colors.text.primary,
    letterSpacing: "-0.025em",
    lineHeight: 1.15,
  },

  actionDialogSubtitle: {
    mt: 0.55,
    fontSize: 12,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  actionDialogContent: {
    px: {
      xs: 2,
      sm: 3,
    },
    pt: "4px !important",
    pb: 1,
  },

  actionDialogDescription: {
    fontSize: 13,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.55,
  },

  actionDialogSummary: {
    mt: 2,
    p: 1.6,
    borderRadius: "13px",
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  actionDialogSummaryHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.25,
    pr: 0.5,
  },

  actionDialogReservationCode: {
    fontSize: 14,
    fontWeight: 800,
    color: colors.brand.primary,
    letterSpacing: "-0.01em",
  },

  actionDialogSummaryMeta: {
    mt: 0.65,
    fontSize: 12,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  actionDialogTextField: {
    mt: 2,

    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: colors.background.surface,
      fontSize: 13,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },

    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.strong,
    },

    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.brand.primary,
      borderWidth: 1.5,
    },
  },

  actionDialogAlert: {
    mt: 2,
    borderRadius: "12px",
  },

  actionDialogActions: {
    px: {
      xs: 2,
      sm: 3,
    },
    pt: 1.5,
    pb: {
      xs: 2,
      sm: 2.5,
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "auto minmax(180px, auto)",
    },
    justifyContent: "end",
    gap: 1,
  },

  actionDialogSecondaryButton: {
    minHeight: 44,
    px: 2.25,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13,
    fontWeight: 700,
    color: colors.text.secondary,
    borderColor: colors.border.default,

    "&:hover": {
      color: colors.text.primary,
      borderColor: colors.border.strong,
      backgroundColor: colors.background.soft,
    },
  },

  actionDialogDangerButton: {
    minHeight: 44,
    px: 2.4,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13,
    fontWeight: 800,
    boxShadow: "none",

    "&:hover": {
      boxShadow: "none",
    },
  },

  actionDialogPrimaryButton: {
    minHeight: 44,
    px: 2.4,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13,
    fontWeight: 800,
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    boxShadow: "0 10px 22px rgba(47, 111, 70, 0.2)",

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 12px 24px rgba(47, 111, 70, 0.24)",
    },
  },

  /* =========================================================
     ESTADOS UX
  ========================================================= */

  stateWrapper: {
    minHeight: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: 2,
    py: 5,
  },

  stateContent: {
    maxWidth: 420,
    textAlign: "center",
  },

  stateIcon: {
    width: 58,
    height: 58,
    mx: "auto",
    mb: 1.75,
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    color: colors.brand.primary,
    backgroundColor: colors.background.soft,

    "& svg": {
      fontSize: 31,
    },
  },

  stateIconError: {
    color: colors.state.error,
    backgroundColor: subtleRed,
  },

  stateTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: colors.text.primary,
    letterSpacing: "-0.025em",
  },

  stateDescription: {
    mt: 0.9,
    fontSize: 13.5,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.5,
  },

  stateButton: {
    mt: 2,
    minHeight: 42,
    px: 2.5,
    borderRadius: "11px",
    textTransform: "none",
    fontWeight: 700,
  },

  detailEmptyState: {
    minHeight: 420,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 3,
  },

  /* =========================================================
     SKELETONS
  ========================================================= */

  skeletonSummaryCard: {
    minHeight: 126,
    p: {
      xs: 2,
      md: "22px 20px",
    },
    display: "flex",
    alignItems: "center",
    gap: 2,
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: cardShadow,
  },

  skeletonTableRow: {
    minHeight: 92,
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: reservationsTableColumns,
    },
    alignItems: "center",
    gap: 2,
    px: {
      xs: 1.5,
      md: 2,
    },
    py: 1.5,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  skeletonDetail: {
    minHeight: 560,
    p: {
      xs: 2,
      md: 2.5,
    },
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },
};
