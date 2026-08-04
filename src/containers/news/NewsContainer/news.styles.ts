import { alpha } from "@mui/material/styles";

import { colors } from "@/theme/colors";

const panelShadow = "0 18px 46px rgba(24, 42, 32, 0.065)";

const detailShadow = "0 20px 50px rgba(24, 42, 32, 0.075)";

const cardShadow = "0 12px 28px rgba(15, 39, 27, 0.032)";

const dialogShadow = "0 28px 80px rgba(15, 39, 27, 0.18)";

const neutralStrong = alpha(colors.text.primary, 0.82);

const neutralLabel = alpha(colors.text.primary, 0.68);

const neutralBorder = alpha(colors.text.primary, 0.11);

const selectedSurface = alpha(colors.brand.primary, 0.065);

const activeSurface = alpha(colors.state.success, 0.1);

const inactiveSurface = alpha(colors.state.error, 0.085);

const warningSurface = alpha(colors.state.warning, 0.1);

const informationSurface = "#EEF5FF";

const newsTableColumns = "minmax(250px, 1.6fr) 82px 104px 112px 92px 30px";

export const newsStyles = {
  /* =========================================================
     ESTRUCTURA GENERAL
  ========================================================= */

  page: {
    width: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: {
      xs: 1.75,
      md: 2,
    },
  },

  /* =========================================================
     MÉTRICAS
  ========================================================= */

  summaryGrid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      xl: "repeat(4, minmax(0, 1fr))",
    },
    gap: 1.5,
  },

  summaryCard: {
    minHeight: {
      xs: 104,
      md: 108,
    },
    p: {
      xs: 1.75,
      md: "18px 20px",
    },
    display: "flex",
    alignItems: "center",
    gap: 1.6,
    borderRadius: "17px",
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.surface,
    boxShadow: cardShadow,
  },

  summaryIcon: (
    tone: "active" | "inactive" | "published" | "notifications",
  ) => {
    const tones = {
      active: {
        color: colors.state.success,
        backgroundColor: activeSurface,
      },
      inactive: {
        color: colors.state.error,
        backgroundColor: inactiveSurface,
      },
      published: {
        color: colors.state.success,
        backgroundColor: activeSurface,
      },
      notifications: {
        color: colors.state.success,
        backgroundColor: activeSurface,
      },
    };

    return {
      width: 48,
      height: 48,
      flexShrink: 0,
      display: "grid",
      placeItems: "center",
      borderRadius: "14px",
      color: tones[tone].color,
      backgroundColor: tones[tone].backgroundColor,

      "& svg": {
        fontSize: 27,
      },
    };
  },

  summaryContent: {
    minWidth: 0,
  },

  summaryLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.text.secondary,
    lineHeight: 1.2,
  },

  summaryValue: {
    mt: 0.55,
    fontSize: {
      xs: 24,
      md: 26,
    },
    fontWeight: 750,
    lineHeight: 1,
    letterSpacing: "-0.035em",
    color: colors.text.primary,
  },

  summaryHint: {
    mt: 0.65,
    fontSize: 11.25,
    fontWeight: 400,
    color: colors.text.muted,
    lineHeight: 1.3,
  },

  /* =========================================================
     MASTER / DETAIL
  ========================================================= */

  contentGrid: {
    width: "100%",
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      lg: "minmax(0, 1.08fr) minmax(430px, 0.92fr)",
      xl: "minmax(0, 1.04fr) minmax(500px, 0.96fr)",
    },
    gap: {
      xs: 1.75,
      md: 2.25,
    },
    alignItems: "stretch",
  },

  panel: {
    minWidth: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "20px",
    border: `1px solid ${neutralBorder}`,
    backgroundColor: colors.background.surface,
    boxShadow: panelShadow,

    "& > *": {
      minWidth: 0,
    },
  },

  listPanel: {
    minHeight: {
      xs: 560,
      lg: 600,
      xl: 620,
    },
  },

  detailPanel: {
    minHeight: {
      xs: 500,
      lg: 600,
      xl: 620,
    },
    boxShadow: detailShadow,
  },

  /* =========================================================
     ENCABEZADOS
  ========================================================= */

  listPanelHeader: {
    minHeight: 82,
    px: {
      xs: 2,
      sm: 2.5,
    },
    py: {
      xs: 1.75,
      md: 2,
    },
    display: "flex",
    flexDirection: {
      xs: "column",
      xl: "row",
    },
    alignItems: {
      xs: "stretch",
      xl: "center",
    },
    justifyContent: "space-between",
    gap: 1.35,
    borderBottom: `1px solid ${neutralBorder}`,
  },

  panelHeader: {
    minHeight: 82,
    px: {
      xs: 2,
      sm: 2.5,
    },
    py: {
      xs: 1.75,
      md: 2,
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
    borderBottom: `1px solid ${neutralBorder}`,
  },

  panelHeaderContent: {
    minWidth: 0,
  },

  panelTitle: {
    fontSize: {
      xs: 16.5,
      md: 18,
    },
    fontWeight: 700,
    letterSpacing: "-0.015em",
    color: colors.text.primary,
    lineHeight: 1.25,
  },

  panelHint: {
    mt: 0.4,
    fontSize: {
      xs: 12.5,
      md: 13,
    },
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  /* =========================================================
     TOOLBAR
  ========================================================= */

  toolbar: {
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "minmax(210px, 1fr) auto auto",
    },
    alignItems: "center",
    gap: 0.8,
  },

  searchField: {
    width: {
      xs: "100%",
      xl: 235,
    },

    "& .MuiOutlinedInput-root": {
      height: 46,
      borderRadius: "13px",
      backgroundColor: colors.background.surface,
      color: colors.text.primary,
      fontSize: 14,
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

    "& .MuiInputBase-input::placeholder": {
      color: colors.text.muted,
      opacity: 1,
    },

    "& .MuiInputAdornment-root svg": {
      fontSize: 20,
      color: colors.text.secondary,
    },
  },

  filterButton: {
    minHeight: 46,
    px: 2.15,
    borderRadius: "13px",
    textTransform: "none",
    fontSize: 14,
    fontWeight: 650,
    color: colors.brand.primary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    whiteSpace: "nowrap",

    "&:hover": {
      color: colors.brand.primaryDark,
      borderColor: colors.brand.primary,
      backgroundColor: colors.background.soft,
    },
  },

  filterCounter: {
    minWidth: 19,
    height: 19,
    ml: 0.65,
    px: 0.6,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    fontSize: 10,
    fontWeight: 750,
    lineHeight: 1,
  },

  createButton: {
    minHeight: 46,
    px: 2.35,
    borderRadius: "13px",
    textTransform: "none",
    fontSize: 14,
    fontWeight: 700,
    whiteSpace: "nowrap",
    boxShadow: `0 8px 18px ${alpha(colors.brand.primary, 0.16)}`,

    "&:hover": {
      boxShadow: `0 10px 22px ${alpha(colors.brand.primary, 0.22)}`,
    },
  },

  alert: {
    borderRadius: "13px",
    border: `1px solid ${alpha(colors.state.error, 0.18)}`,
  },

  /* =========================================================
     TABLA
  ========================================================= */

  tableViewport: {
    width: "100%",
    minWidth: 0,
    flex: 1,
    overflowX: "auto",
    overflowY: "hidden",
  },

  tableContent: {
    minWidth: 760,
  },

  tableHeader: {
    minHeight: 48,
    px: 2.25,
    display: "grid",
    gridTemplateColumns: newsTableColumns,
    alignItems: "center",
    gap: 1,
    backgroundColor: alpha(colors.text.primary, 0.025),
    borderBottom: `1px solid ${neutralBorder}`,
  },

  tableHeaderCell: {
    minWidth: 0,
    fontSize: 11.25,
    fontWeight: 700,
    letterSpacing: "0.055em",
    textTransform: "uppercase",
    color: neutralLabel,
    lineHeight: 1.2,
  },

  listBody: {
    minWidth: 0,
  },

  tableRow: {
    position: "relative",
    minHeight: 78,
    px: 2.25,
    display: "grid",
    gridTemplateColumns: newsTableColumns,
    alignItems: "center",
    gap: 1,
    borderBottom: `1px solid ${neutralBorder}`,
    cursor: "pointer",
    backgroundColor: colors.background.surface,
    transition: "background-color 150ms ease, box-shadow 150ms ease",

    "&:hover": {
      backgroundColor: alpha(colors.background.soft, 0.68),
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.brand.primary, 0.2)}`,
      outlineOffset: -3,
    },

    "&:last-of-type": {
      borderBottom: "none",
    },
  },

  tableRowSelected: {
    backgroundColor: selectedSurface,
    boxShadow: `inset 4px 0 0 ${colors.brand.primary}`,

    "&:hover": {
      backgroundColor: selectedSurface,
    },
  },

  titleCell: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 1.1,
  },

  newsAvatar: (inactive = false) => ({
    width: 40,
    height: 40,
    flexShrink: 0,
    fontSize: 11.5,
    fontWeight: 700,
    color: inactive ? colors.state.error : colors.brand.primaryDark,
    backgroundColor: inactive ? inactiveSurface : colors.brand.primaryLight,
    border: `1px solid ${
      inactive
        ? alpha(colors.state.error, 0.12)
        : alpha(colors.brand.primary, 0.12)
    }`,
  }),

  titleTextContainer: {
    minWidth: 0,
    display: "block",
  },

  newsTitle: {
    display: "block",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 13.25,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  newsPreview: {
    display: "block",
    minWidth: 0,
    mt: 0.3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 11.75,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.3,
  },

  statusCell: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
  },

  statusChip: (status: "ACTIVA" | "INACTIVA") => ({
    height: 27,
    borderRadius: "9px",
    fontSize: 11.5,
    fontWeight: 650,
    color: status === "ACTIVA" ? colors.state.success : colors.state.error,
    backgroundColor: status === "ACTIVA" ? activeSurface : inactiveSurface,
    border: `1px solid ${
      status === "ACTIVA"
        ? alpha(colors.state.success, 0.16)
        : alpha(colors.state.error, 0.14)
    }`,

    "& .MuiChip-label": {
      px: 0.9,
    },
  }),

  tableValue: {
    display: "block",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 12.25,
    fontWeight: 500,
    color: neutralStrong,
    lineHeight: 1.35,
  },

  notificationCount: {
    display: "block",
    minWidth: 0,
    fontSize: 12.25,
    fontWeight: 650,
    color: colors.text.primary,
    lineHeight: 1.35,
  },

  rowAction: {
    width: 34,
    height: 34,
    justifySelf: "end",
    display: "grid",
    placeItems: "center",
    color: colors.text.secondary,
    borderRadius: "9px",

    "& svg": {
      fontSize: 18,
    },
  },

  /* =========================================================
     PIE Y PAGINACIÓN
  ========================================================= */

  listFooter: {
    minHeight: 74,
    mt: "auto",
    px: {
      xs: 1.75,
      sm: 2.25,
    },
    py: 1.15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: `1px solid ${neutralBorder}`,
  },

  paginationWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },

  resultsText: {
    fontSize: 11,
    fontWeight: 450,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  /* =========================================================
     LOADING Y ESTADOS VACÍOS
  ========================================================= */

  loadingText: {
    fontSize: 13,
    fontWeight: 500,
    color: colors.text.secondary,
  },

  stateContainer: {
    flex: 1,
    minHeight: 300,
    px: 3,
    py: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  stateIconSurface: {
    width: 56,
    height: 56,
    display: "grid",
    placeItems: "center",
    borderRadius: "17px",
    color: colors.brand.primary,
    backgroundColor: colors.background.soft,

    "& svg": {
      fontSize: 30,
    },
  },

  stateTitle: {
    mt: 1.6,
    fontSize: 15.5,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  stateDescription: {
    mt: 0.7,
    maxWidth: 390,
    fontSize: 12.25,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.55,
  },

  /* =========================================================
     DETALLE
  ========================================================= */

  detailContent: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },

  detailHero: {
    px: {
      xs: 2,
      sm: 2.75,
    },
    py: {
      xs: 2.5,
      sm: 2.9,
    },
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    alignItems: {
      xs: "stretch",
      sm: "flex-start",
    },
    justifyContent: "space-between",
    gap: {
      xs: 1.5,
      md: 1.75,
    },
    background: `linear-gradient(
      135deg,
      ${colors.background.surface} 0%,
      ${alpha(colors.background.soft, 0.72)} 100%
    )`,
  },

  detailIdentity: {
    minWidth: 0,
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    gap: {
      xs: 1.5,
      md: 1.75,
    },
  },

  detailAvatar: (inactive = false) => ({
    width: 64,
    height: 64,
    flexShrink: 0,
    fontSize: 19,
    fontWeight: 700,
    color: inactive ? colors.state.error : colors.brand.primaryDark,
    backgroundColor: inactive ? inactiveSurface : colors.brand.primaryLight,
    border: `1px solid ${
      inactive
        ? alpha(colors.state.error, 0.12)
        : alpha(colors.brand.primary, 0.14)
    }`,
  }),

  detailIdentityText: {
    minWidth: 0,
  },

  detailTitle: {
    overflowWrap: "anywhere",
    fontSize: {
      xs: 20,
      sm: 22,
    },
    fontWeight: 700,
    letterSpacing: "-0.025em",
    color: colors.text.primary,
    lineHeight: 1.25,
  },

  detailMeta: {
    mt: 0.45,
    fontSize: 13.25,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  detailStatusRow: {
    mt: 1.15,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 0.7,
  },

  detailActions: {
    flexShrink: 0,
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    alignItems: "stretch",
    gap: 0.7,
  },

  secondaryActionButton: {
    minHeight: 42,
    px: 2,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 650,
    color: colors.brand.primary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    whiteSpace: "nowrap",

    "&:hover": {
      color: colors.brand.primaryDark,
      borderColor: colors.brand.primary,
      backgroundColor: colors.background.soft,
    },
  },

  detailSection: {
    scrollMarginTop: 16,
    px: {
      xs: 2,
      sm: 2.75,
    },
    py: {
      xs: 2.65,
      sm: 3.05,
    },
    borderTop: `1px solid ${neutralBorder}`,
  },

  sectionHeading: {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    mb: 1.95,
  },

  sectionIconSurface: {
    width: 28,
    height: 28,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "8px",
    color: colors.brand.primaryDark,
    backgroundColor: colors.background.soft,

    "& svg": {
      fontSize: 16,
    },
  },

  sectionTitle: {
    fontSize: 11.75,
    fontWeight: 700,
    letterSpacing: "0.065em",
    textTransform: "uppercase",
    color: colors.brand.primaryDark,
    lineHeight: 1.2,
  },

  informationGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
    },
    columnGap: {
      xs: 1.75,
      sm: 2.4,
    },
    rowGap: {
      xs: 2.15,
      sm: 2.55,
    },
  },

  detailItem: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },

  detailLabel: {
    fontSize: 11.25,
    fontWeight: 650,
    letterSpacing: "0.035em",
    textTransform: "uppercase",
    color: neutralLabel,
    lineHeight: 1.25,
  },

  detailValueRow: {
    mt: 0.8,
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 0.6,
  },

  detailValueIcon: {
    fontSize: 16,
    color: colors.text.secondary,
  },

  detailValue: {
    minWidth: 0,
    overflowWrap: "anywhere",
    fontSize: 13.25,
    fontWeight: 500,
    color: colors.text.primary,
    lineHeight: 1.45,
  },

  contentText: {
    overflowWrap: "anywhere",
    whiteSpace: "pre-wrap",
    fontSize: 13.25,
    fontWeight: 400,
    color: neutralStrong,
    lineHeight: 1.65,
  },

  /* =========================================================
     ENTREGAS
  ========================================================= */

  deliveryGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, minmax(0, 1fr))",
      sm: "repeat(4, minmax(0, 1fr))",
    },
    gap: 1.25,
  },

  deliveryCard: {
    minWidth: 0,
    minHeight: 76,
    p: 1.7,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "12px",
    border: `1px solid ${colors.border.default}`,
    backgroundColor: alpha(colors.background.soft, 0.45),
  },

  deliveryLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 11.25,
    fontWeight: 650,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: neutralLabel,
    lineHeight: 1.2,
  },

  deliveryValue: (tone: "default" | "success" | "error" | "warning") => {
    const tones = {
      default: colors.text.primary,
      success: colors.state.success,
      error: colors.state.error,
      warning: colors.state.warning,
    };

    return {
      mt: 0.7,
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: "-0.025em",
      color: tones[tone],
      lineHeight: 1,
    };
  },

  informationBanner: {
    mx: {
      xs: 2,
      sm: 2.75,
    },
    mt: 2.1,
    mb: {
      xs: 2,
      sm: 2.5,
    },
    p: 1.4,
    display: "flex",
    alignItems: "flex-start",
    gap: 0.85,
    borderRadius: "11px",
    color: "#1565C0",
    backgroundColor: informationSurface,
    border: `1px solid ${alpha("#1565C0", 0.14)}`,

    "& svg": {
      mt: 0.1,
      flexShrink: 0,
      fontSize: 18,
    },
  },

  informationBannerText: {
    fontSize: 12.25,
    fontWeight: 450,
    color: "#1565C0",
    lineHeight: 1.45,
  },

  detailLoading: {
    flex: 1,
    minHeight: 360,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1.3,
  },

  /* =========================================================
     MOBILE
  ========================================================= */

  mobileDialogContent: {
    p: 0,
    backgroundColor: colors.background.app,
  },

  mobileDetailHeader: {
    minHeight: 64,
    px: 1.25,
    display: "grid",
    gridTemplateColumns: "38px minmax(0, 1fr) 38px",
    alignItems: "center",
    gap: 1,
    borderBottom: `1px solid ${neutralBorder}`,
    backgroundColor: colors.background.surface,
  },

  mobileDetailTitle: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    textAlign: "center",
    fontSize: 16,
    fontWeight: 750,
    color: colors.text.primary,
  },

  closeButton: {
    width: 38,
    height: 38,
    color: colors.text.primary,
    borderRadius: "11px",

    "&:hover": {
      backgroundColor: colors.background.soft,
    },
  },

  /* =========================================================
     MODALES
  ========================================================= */

  modalPaper: {
    width: "100%",
    m: {
      xs: 1.5,
      sm: 3,
    },
    borderRadius: {
      xs: "18px",
      sm: "22px",
    },
    border: `1px solid ${neutralBorder}`,
    backgroundColor: colors.background.surface,
    boxShadow: dialogShadow,
    overflow: "hidden",
  },

  modalHeader: {
    px: {
      xs: 2,
      sm: 2.5,
    },
    py: 2,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 1.5,
    borderBottom: `1px solid ${neutralBorder}`,
  },

  modalHeaderContent: {
    minWidth: 0,
  },

  modalTitle: {
    p: 0,
    fontSize: {
      xs: 18,
      sm: 20,
    },
    fontWeight: 750,
    letterSpacing: "-0.025em",
    color: colors.text.primary,
    lineHeight: 1.25,
  },

  modalSubtitle: {
    mt: 0.55,
    fontSize: 12.5,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.5,
  },

  modalCloseButton: {
    width: 38,
    height: 38,
    flexShrink: 0,
    color: colors.text.secondary,
    borderRadius: "11px",

    "&:hover": {
      color: colors.text.primary,
      backgroundColor: colors.background.soft,
    },
  },

  modalContent: {
    p: {
      xs: 2,
      sm: 2.5,
    },
  },

  formStack: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  field: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: colors.background.surface,
      fontSize: 13.5,
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

    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.brand.primary,
    },

    "& .MuiFormHelperText-root": {
      mx: 0,
      mt: 0.65,
      fontSize: 11.25,
    },
  },

  contentField: {
    "& .MuiOutlinedInput-root": {
      alignItems: "flex-start",
    },

    "& textarea": {
      minHeight: "150px !important",
      lineHeight: 1.6,
    },
  },

  characterCounter: {
    mt: -1.35,
    display: "flex",
    justifyContent: "flex-end",
    fontSize: 10.75,
    fontWeight: 500,
    color: colors.text.muted,
  },

  publicationNotice: {
    p: 1.5,
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    borderRadius: "12px",
    color: colors.brand.primaryDark,
    backgroundColor: colors.background.soft,
    border: `1px solid ${alpha(colors.brand.primary, 0.12)}`,

    "& svg": {
      mt: 0.1,
      flexShrink: 0,
      fontSize: 19,
      color: colors.brand.primary,
    },
  },

  publicationNoticeText: {
    fontSize: 11.75,
    fontWeight: 450,
    color: colors.text.secondary,
    lineHeight: 1.5,
  },

  modalActions: {
    px: {
      xs: 2,
      sm: 2.5,
    },
    py: 1.75,
    gap: 1,
    borderTop: `1px solid ${neutralBorder}`,
    backgroundColor: alpha(colors.background.soft, 0.35),
  },

  cancelButton: {
    minHeight: 42,
    px: 2,
    borderRadius: "11px",
    textTransform: "none",
    fontSize: 13,
    fontWeight: 650,
    color: colors.text.secondary,

    "&:hover": {
      color: colors.text.primary,
      backgroundColor: alpha(colors.text.primary, 0.05),
    },
  },

  submitButton: {
    minHeight: 42,
    px: 2.25,
    borderRadius: "11px",
    textTransform: "none",
    fontSize: 13,
    fontWeight: 700,
    boxShadow: `0 9px 20px ${alpha(colors.brand.primary, 0.18)}`,

    "&:hover": {
      boxShadow: `0 11px 24px ${alpha(colors.brand.primary, 0.24)}`,
    },
  },

  dangerButton: {
    minHeight: 42,
    px: 2.25,
    borderRadius: "11px",
    textTransform: "none",
    fontSize: 13,
    fontWeight: 700,
    color: colors.text.inverse,
    backgroundColor: colors.state.error,
    boxShadow: `0 9px 20px ${alpha(colors.state.error, 0.18)}`,

    "&:hover": {
      backgroundColor: "#8F1D15",
      boxShadow: `0 11px 24px ${alpha(colors.state.error, 0.24)}`,
    },
  },

  /* =========================================================
     FILTROS
  ========================================================= */

  filterOptions: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },

  filterOption: (selected: boolean) => ({
    width: "100%",
    p: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    textAlign: "left",
    borderRadius: "13px",
    border: `1px solid ${
      selected ? colors.brand.primary : colors.border.default
    }`,
    backgroundColor: selected ? selectedSurface : colors.background.surface,
    transition: "border-color 150ms ease, background-color 150ms ease",

    "&:hover": {
      borderColor: colors.brand.primary,
      backgroundColor: colors.background.soft,
    },
  }),

  filterOptionIcon: (selected: boolean) => ({
    width: 38,
    height: 38,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "11px",
    color: selected ? colors.brand.primary : colors.text.secondary,
    backgroundColor: selected
      ? colors.brand.primaryLight
      : colors.background.soft,

    "& svg": {
      fontSize: 21,
    },
  }),

  filterOptionContent: {
    minWidth: 0,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 0.35,
  },

  filterOptionTitle: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  filterOptionDescription: {
    display: "block",
    fontSize: 11.5,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  filterSelectedIndicator: {
    width: 20,
    height: 20,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,

    "& svg": {
      fontSize: 14,
    },
  },

  /* =========================================================
     CAMBIO DE ESTADO
  ========================================================= */

  statusSummary: {
    p: 1.5,
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    borderRadius: "13px",
    border: `1px solid ${colors.border.default}`,
    backgroundColor: alpha(colors.background.soft, 0.55),
  },

  statusSummaryContent: {
    minWidth: 0,
  },

  statusSummaryTitle: {
    overflowWrap: "anywhere",
    fontSize: 13.5,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.35,
  },

  statusSummaryMeta: {
    mt: 0.35,
    fontSize: 11.5,
    fontWeight: 450,
    color: colors.text.secondary,
    lineHeight: 1.35,
  },

  statusWarning: (activation: boolean) => ({
    mt: 2,
    p: 1.5,
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    borderRadius: "12px",
    color: activation ? colors.brand.primaryDark : colors.state.warning,
    backgroundColor: activation ? colors.background.soft : warningSurface,
    border: `1px solid ${
      activation
        ? alpha(colors.brand.primary, 0.12)
        : alpha(colors.state.warning, 0.18)
    }`,

    "& svg": {
      mt: 0.1,
      flexShrink: 0,
      fontSize: 19,
    },
  }),

  statusWarningText: {
    fontSize: 11.75,
    fontWeight: 450,
    lineHeight: 1.5,
  },

  /* =========================================================
     FEEDBACK
  ========================================================= */

  feedbackAlert: {
    minWidth: {
      xs: "calc(100vw - 32px)",
      sm: 360,
    },
    maxWidth: 520,
    borderRadius: "13px",
    boxShadow: "0 18px 44px rgba(15, 39, 27, 0.2)",
  },
} as const;