import { alpha, type Theme } from "@mui/material/styles";

import { colors } from "@/theme/colors";

/*
Estilos del módulo administrativo de Socios.

Criterios aplicados:
- diseño premium alineado con los módulos Gold;
- arquitectura Master / Detail;
- mobile first y responsive real;
- jerarquía visual clara para búsqueda, filtros y acciones;
- estados accesibles y consistentes;
- estilos preparados para listado, detalle y modales;
- uso exclusivo de tokens globales siempre que corresponde.
*/

const panelShadow = "0 18px 46px rgba(24, 42, 32, 0.065)";
const detailShadow = "0 20px 50px rgba(24, 42, 32, 0.075)";
const dialogShadow = "0 28px 80px rgba(15, 39, 27, 0.18)";

const neutralStrong = alpha(colors.text.primary, 0.82);
const neutralSecondary = alpha(colors.text.primary, 0.64);
const neutralLabel = alpha(colors.text.primary, 0.68);

const neutralBorder = alpha(colors.text.primary, 0.11);
const selectedSurface = alpha(colors.brand.primary, 0.065);

const membersTableColumns =
  "minmax(255px, 1.45fr) minmax(118px, 0.7fr) minmax(118px, 0.7fr) minmax(96px, 0.55fr) minmax(138px, 0.78fr)";

export const membersStyles = {
  /* =========================================================
     ESTRUCTURA GENERAL
  ========================================================= */

  root: {
    width: "100%",
  },

  pageContent: {
    width: "100%",
    maxWidth: "none",
    mx: 0,
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    gap: {
      xs: 2,
      md: 2.75,
    },
  },

  /* =========================================================
     ENCABEZADO OPERATIVO
  ========================================================= */

  toolbar: {
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
    gap: 2,
  },

  toolbarCopy: {
    minWidth: 0,
  },

  sectionTitle: {
    fontSize: {
      xs: 22,
      sm: 25,
    },
    fontWeight: 750,
    letterSpacing: "-0.035em",
    color: colors.text.primary,
    lineHeight: 1.15,
  },

  sectionSubtitle: {
    mt: 0.7,
    fontSize: {
      xs: 13.5,
      sm: 14.25,
    },
    fontWeight: 400,
    color: neutralSecondary,
    lineHeight: 1.5,
  },

  toolbarActions: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "minmax(260px, 1fr) auto auto",
    },
    alignItems: "center",
    gap: 1,
    width: {
      xs: "100%",
      xl: "auto",
    },
  },

  searchField: {
    width: {
      xs: "100%",
      xl: 340,
    },

    "& .MuiOutlinedInput-root": {
      height: 46,
      borderRadius: "13px",
      backgroundColor: colors.background.surface,
      color: colors.text.primary,
      fontSize: 14,
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

    "& .MuiInputBase-input::placeholder": {
      color: colors.text.muted,
      opacity: 1,
    },

    "& .MuiInputAdornment-root svg": {
      fontSize: 20,
      color: colors.text.secondary,
    },

    "& .MuiOutlinedInput-root.Mui-focused .MuiInputAdornment-root svg": {
      color: colors.brand.primary,
    },
  },

  primaryButton: {
    minHeight: 46,
    px: 2.35,
    borderRadius: "13px",
    textTransform: "none",
    fontSize: 14,
    fontWeight: 700,
    whiteSpace: "nowrap",
    boxShadow: `0 10px 22px ${alpha(colors.brand.primary, 0.18)}`,

    "&:hover": {
      boxShadow: `0 12px 26px ${alpha(colors.brand.primary, 0.24)}`,
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

  secondaryButton: {
    minHeight: 42,
    px: 2,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 650,
    color: colors.brand.primary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,

    "&:hover": {
      borderColor: colors.brand.primary,
      backgroundColor: colors.background.soft,
    },
  },

  activeFiltersRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 1,
    minHeight: 38,
  },

  activeFilterChip: {
    height: 34,
    borderRadius: "11px",
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primary, 0.065),
    borderColor: alpha(colors.brand.primary, 0.18),
    fontSize: 12.25,
    fontWeight: 650,
    boxShadow: "0 4px 12px rgba(24, 42, 32, 0.035)",

    "& .MuiChip-label": {
      px: 1.35,
    },

    "& .MuiChip-deleteIcon": {
      mr: 0.65,
      color: alpha(colors.brand.primaryDark, 0.46),
      transition: "color 150ms ease",

      "&:hover": {
        color: colors.brand.primaryDark,
      },
    },
  },

  clearFiltersButton: {
    minHeight: 34,
    px: 1.5,
    borderRadius: "11px",
    textTransform: "none",
    color: neutralSecondary,
    borderColor: neutralBorder,
    backgroundColor: colors.background.surface,
    fontSize: 12.25,
    fontWeight: 650,
    boxShadow: "0 4px 12px rgba(24, 42, 32, 0.035)",
    transition:
      "color 150ms ease, border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease",

    "& .MuiButton-startIcon": {
      mr: 0.7,

      "& svg": {
        fontSize: 17,
      },
    },

    "&:hover": {
      color: colors.brand.primaryDark,
      borderColor: alpha(colors.brand.primary, 0.35),
      backgroundColor: alpha(colors.brand.primary, 0.045),
      boxShadow: "0 6px 16px rgba(24, 42, 32, 0.055)",
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.brand.primary, 0.16)}`,
      outlineOffset: 2,
    },
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
      md: 690,
      xl: 710,
    },
  },

  detailPanel: {
    minHeight: {
      xs: 500,
      lg: 690,
      xl: 710,
    },
    position: "static",
    boxShadow: detailShadow,
  },

  panelHeader: {
    display: "flex",
    alignItems: {
      xs: "flex-start",
      sm: "center",
    },
    justifyContent: "space-between",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    gap: 1.25,
    px: {
      xs: 2,
      sm: 2.5,
    },
    py: {
      xs: 2,
      md: 2.25,
    },
    borderBottom: `1px solid ${neutralBorder}`,
    backgroundColor: colors.background.surface,
  },

  panelHeaderContent: {
    minWidth: 0,
  },

  panelHeaderActions: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 0.75,
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
    color: neutralSecondary,
    lineHeight: 1.4,
  },

  panelCount: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 32,
    height: 28,
    px: 1,
    borderRadius: "9px",
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primary, 0.075),
    fontSize: 12,
    fontWeight: 650,
  },

  /* =========================================================
     TABLA / LISTADO DE SOCIOS
  ========================================================= */

  tableViewport: {
    width: "100%",
    flex: 1,
    overflowX: "auto",
  },

  membersTable: {
    minWidth: {
      xs: "100%",
      md: 790,
    },
  },

  tableHeader: {
    display: {
      xs: "none",
      md: "grid",
    },
    gridTemplateColumns: membersTableColumns,
    alignItems: "center",
    gap: 1.5,
    minHeight: 48,
    px: 2.75,
    backgroundColor: alpha(colors.text.primary, 0.025),
    borderBottom: `1px solid ${neutralBorder}`,
  },

  tableHeaderCell: {
    fontSize: 11.25,
    fontWeight: 700,
    letterSpacing: "0.055em",
    textTransform: "uppercase",
    color: neutralLabel,
    whiteSpace: "nowrap",
  },

  membersList: {
    display: "flex",
    flexDirection: "column",
  },

  memberRow: (isSelected: boolean) => ({
    position: "relative",
    width: "100%",
    minHeight: {
      xs: 84,
      md: 78,
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      md: membersTableColumns,
    },
    alignItems: "center",
    gap: {
      xs: 1.4,
      md: 1.75,
    },
    px: {
      xs: 2,
      sm: 2.35,
      md: 2.75,
    },
    py: {
      xs: 1.7,
      md: 1.55,
    },
    border: 0,
    borderBottom: `1px solid ${neutralBorder}`,
    backgroundColor: isSelected ? selectedSurface : colors.background.surface,
    cursor: "pointer",
    textAlign: "left",
    transition: "background-color 160ms ease, box-shadow 160ms ease",

    "&::before": {
      content: '""',
      position: "absolute",
      inset: "0 auto 0 0",
      width: 4,
      borderRadius: "0 5px 5px 0",
      backgroundColor: isSelected ? colors.brand.primary : "transparent",
      transition: "background-color 160ms ease",
    },

    "&:hover": {
      backgroundColor: isSelected
        ? alpha(colors.brand.primary, 0.085)
        : alpha(colors.text.primary, 0.022),
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.brand.primary, 0.2)}`,
      outlineOffset: -3,
      zIndex: 1,
    },

    "&:last-of-type": {
      borderBottom: 0,
    },
  }),

  memberIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 1.45,
    minWidth: 0,
  },

  memberAvatar: {
    width: {
      xs: 46,
      md: 48,
    },
    height: {
      xs: 46,
      md: 48,
    },
    flexShrink: 0,
    backgroundColor: colors.brand.primaryLight,
    color: colors.brand.primaryDark,
    border: `1px solid ${alpha(colors.brand.primary, 0.14)}`,
    fontSize: 13.5,
    fontWeight: 700,
  },

  memberMainData: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 0.3,
  },

  memberName: {
    display: "block",
    width: "100%",
    fontSize: {
      xs: 14.25,
      md: 14.75,
    },
    fontWeight: 650,
    color: colors.text.primary,
    lineHeight: 1.3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  memberEmail: {
    display: "block",
    width: "100%",
    mt: 0,
    fontSize: {
      xs: 12,
      md: 12.25,
    },
    fontWeight: 400,
    color: neutralSecondary,
    lineHeight: 1.35,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  memberSecondaryData: {
    display: "flex",
    flexDirection: {
      xs: "row",
      md: "column",
    },
    alignItems: {
      xs: "center",
      md: "flex-start",
    },
    flexWrap: "wrap",
    gap: {
      xs: 0.75,
      md: 0.25,
    },
    minWidth: 0,
  },

  memberDocument: {
    fontSize: 13,
    fontWeight: 550,
    color: neutralSecondary,
    whiteSpace: "nowrap",
  },

  memberPhone: {
    mt: {
      xs: 0,
      md: 0.3,
    },
    fontSize: 12.25,
    fontWeight: 450,
    color: neutralSecondary,
    whiteSpace: "nowrap",
  },

  memberDataCell: {
    minWidth: 0,
    fontSize: {
      md: 13,
      xl: 13.25,
    },
    fontWeight: 500,
    color: neutralSecondary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  memberStatusArea: {
    display: "flex",
    alignItems: {
      xs: "flex-start",
      md: "flex-start",
    },
    flexDirection: "column",
    gap: 0.55,
    minWidth: 0,
  },

  statusChip: {
    height: 27,
    borderRadius: "9px",
    fontSize: 11.5,
    fontWeight: 650,

    "& .MuiChip-label": {
      px: 1.05,
    },
  },

  accessStatusChip: {
    height: 27,
    borderRadius: "9px",
    fontSize: 11.5,
    fontWeight: 600,
    backgroundColor: colors.background.surface,

    "& .MuiChip-label": {
      px: 1.05,
    },
  },

  consentCell: {
    display: "flex",
    alignItems: "center",
    gap: 0.6,
    minWidth: 0,
  },

  consentIconAccepted: {
    fontSize: 17,
    color: colors.state.success,
    flexShrink: 0,
  },

  consentIconPending: {
    fontSize: 17,
    color: colors.state.warning,
    flexShrink: 0,
  },

  consentText: {
    fontSize: 12.25,
    fontWeight: 500,
    color: neutralSecondary,
    whiteSpace: "nowrap",
  },

  mobileMemberMeta: {
    display: {
      xs: "grid",
      md: "none",
    },
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 1,
    pt: 1.1,
    mt: 0.15,
    borderTop: `1px dashed ${colors.border.default}`,
  },

  mobileMemberMetaItem: {
    minWidth: 0,
  },

  mobileMemberMetaLabel: {
    fontSize: 10.75,
    fontWeight: 650,
    color: neutralLabel,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  mobileMemberMetaValue: {
    mt: 0.25,
    fontSize: 12,
    fontWeight: 650,
    color: colors.text.primary,
    overflowWrap: "anywhere",
  },

  paginationArea: {
    minHeight: 74,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mt: "auto",
    px: 2,
    py: 1.75,
    borderTop: `1px solid ${neutralBorder}`,
    backgroundColor: alpha(colors.text.primary, 0.018),
  },

  /* =========================================================
     PANEL DE DETALLE
  ========================================================= */

  detailContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
  },

  detailHero: {
    display: "flex",
    alignItems: "flex-start",
    gap: {
      xs: 1.5,
      md: 1.75,
    },
    px: {
      xs: 2,
      sm: 2.75,
    },
    py: {
      xs: 2.5,
      sm: 2.9,
    },
    background: `linear-gradient(135deg, ${colors.background.surface} 0%, ${alpha(
      colors.background.soft,
      0.72,
    )} 100%)`,
  },

  detailAvatar: {
    width: 64,
    height: 64,
    flexShrink: 0,
    backgroundColor: colors.brand.primaryLight,
    color: colors.brand.primaryDark,
    border: `1px solid ${alpha(colors.brand.primary, 0.18)}`,
    boxShadow: `0 8px 20px ${alpha(colors.brand.primaryDark, 0.08)}`,
    fontSize: 19,
    fontWeight: 700,
  },

  detailIdentity: {
    minWidth: 0,
    flex: 1,
  },

  detailName: {
    fontSize: {
      xs: 20,
      sm: 22,
    },
    fontWeight: 700,
    letterSpacing: "-0.025em",
    color: colors.text.primary,
    lineHeight: 1.2,
  },

  detailEmail: {
    mt: 0.45,
    fontSize: 13.25,
    fontWeight: 400,
    color: neutralSecondary,
    lineHeight: 1.45,
    overflowWrap: "anywhere",
  },

  detailStatusRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.65,
    mt: 1.15,
  },

  detailActions: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "1fr",
      xl: "repeat(2, minmax(0, 1fr))",
    },
    gap: 0.9,
    px: {
      xs: 2,
      sm: 2.5,
    },
    pb: 2.25,
    backgroundColor: alpha(colors.background.soft, 0.72),
    borderBottom: `1px solid ${colors.border.default}`,
  },

  detailSection: {
    px: {
      xs: 2,
      sm: 2.75,
    },
    py: {
      xs: 2.25,
      sm: 2.55,
    },
    borderTop: `1px solid ${neutralBorder}`,
  },

  detailSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    mb: 1.5,
  },

  detailSectionIcon: {
    width: 28,
    height: 28,
    display: "grid",
    placeItems: "center",
    borderRadius: "9px",
    color: colors.brand.primary,
    backgroundColor: colors.background.soft,

    "& svg": {
      fontSize: 16,
    },
  },

  detailSectionTitle: {
    mb: 1.5,
    fontSize: 11.75,
    fontWeight: 700,
    color: colors.brand.primary,
    textTransform: "uppercase",
    letterSpacing: "0.065em",
    lineHeight: 1.2,
  },

  detailSectionTitleInline: {
    fontSize: 11.75,
    fontWeight: 700,
    color: colors.brand.primary,
    textTransform: "uppercase",
    letterSpacing: "0.065em",
    lineHeight: 1.2,
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(2, minmax(0, 1fr))",
    },
    gap: {
      xs: 1.6,
      sm: 2,
    },
  },

  detailItem: {
    minWidth: 0,
  },

  detailLabel: {
    fontSize: 11.25,
    fontWeight: 650,
    color: neutralLabel,
    textTransform: "uppercase",
    letterSpacing: "0.035em",
    lineHeight: 1.25,
  },

  detailValueRow: {
    display: "flex",
    alignItems: "center",
    gap: 0.65,
    mt: 0.45,
    minWidth: 0,
  },

  detailValueIcon: {
    fontSize: 16,
    color: neutralLabel,
    flexShrink: 0,
  },

  detailValue: {
    mt: 0.4,
    fontSize: 13.25,
    fontWeight: 500,
    color: neutralStrong,
    lineHeight: 1.4,
    overflowWrap: "anywhere",
  },

  detailValueInline: {
    minWidth: 0,
    fontSize: 13.25,
    fontWeight: 500,
    color: neutralStrong,
    lineHeight: 1.4,
    overflowWrap: "anywhere",
  },

  detailStatusValue: {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.65,
    mt: 0.5,
    fontSize: 13.25,
    fontWeight: 550,
    color: neutralStrong,
  },

  detailStatusDot: (color: string) => ({
    width: 8,
    height: 8,
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: color,
    boxShadow: `0 0 0 4px ${alpha(color, 0.12)}`,
  }),

  /* =========================================================
     ESTADOS DE INTERFAZ
  ========================================================= */

  stateContainer: {
    minHeight: 320,
    px: 3,
    py: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  stateIconSurface: {
    width: 58,
    height: 58,
    display: "grid",
    placeItems: "center",
    mb: 1.5,
    borderRadius: "18px",
    color: colors.brand.primary,
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  stateIcon: {
    fontSize: 42,
    color: colors.text.muted,
    mb: 1.5,
  },

  stateTitle: {
    fontSize: 16.5,
    fontWeight: 700,
    color: colors.text.primary,
  },

  stateDescription: {
    mt: 0.75,
    maxWidth: 380,
    fontSize: 13.5,
    color: neutralSecondary,
    lineHeight: 1.5,
  },

  skeletonRow: {
    px: {
      xs: 2,
      sm: 2.5,
    },
    py: 1.55,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  errorAlert: {
    borderRadius: "14px",
    border: `1px solid ${alpha(colors.state.error, 0.18)}`,
  },

  feedbackAlert: {
    borderRadius: "14px",
    border: `1px solid ${colors.border.default}`,
  },

  disabledSurface: {
    backgroundColor: (theme: Theme) =>
      alpha(theme.palette.action.disabledBackground, 0.45),
  },

  /* =========================================================
     FORMULARIO DE ALTA Y EDICIÓN
  ========================================================= */

  memberFormDialog: {
    width: {
      xs: "calc(100% - 24px)",
      sm: "100%",
    },
    m: {
      xs: 1.5,
      sm: 4,
    },
    maxHeight: {
      xs: "calc(100% - 24px)",
      sm: "calc(100% - 64px)",
    },
    overflow: "hidden",
    borderRadius: "22px",
    border: `1px solid ${colors.border.default}`,
    boxShadow: dialogShadow,
  },

  memberFormHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 2,
    px: {
      xs: 2,
      sm: 3,
    },
    py: {
      xs: 2,
      sm: 2.5,
    },
    borderBottom: `1px solid ${colors.border.default}`,
    background: `linear-gradient(135deg, ${colors.background.surface} 0%, ${alpha(
      colors.background.soft,
      0.72,
    )} 100%)`,
  },

  memberFormHeaderContent: {
    minWidth: 0,
  },

  memberFormTitle: {
    p: 0,
    fontSize: {
      xs: 20,
      sm: 22,
    },
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: colors.text.primary,
    lineHeight: 1.2,
  },

  memberFormSubtitle: {
    mt: 0.75,
    maxWidth: 560,
    fontSize: 13.5,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  memberFormCloseButton: {
    width: 38,
    height: 38,
    flexShrink: 0,
    color: colors.text.secondary,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.surface,

    "&:hover": {
      color: colors.text.primary,
      borderColor: colors.border.strong,
      backgroundColor: colors.background.soft,
    },
  },

  memberFormContent: {
    px: {
      xs: 2,
      sm: 3,
    },
    py: {
      xs: 2.25,
      sm: 3,
    },
    backgroundColor: colors.background.surface,
  },

  memberFormIntro: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.4,
    mb: 2.5,
    p: 1.75,
    borderRadius: "15px",
    color: colors.brand.primaryDark,
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  memberFormIntroIcon: {
    width: 38,
    height: 38,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "11px",
    color: colors.brand.primary,
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,

    "& svg": {
      fontSize: 21,
    },
  },

  memberFormIntroTitle: {
    fontSize: 13.5,
    fontWeight: 650,
    color: colors.text.primary,
  },

  memberFormIntroDescription: {
    mt: 0.35,
    fontSize: 12.5,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  memberFormSection: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
  },

  memberFormSectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.brand.primary,
    textTransform: "uppercase",
    letterSpacing: "0.065em",
  },

  memberFormGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(2, minmax(0, 1fr))",
    },
    gap: 1.75,
  },

  memberFormFullWidthField: {
    gridColumn: {
      xs: "auto",
      sm: "1 / -1",
    },
  },

  memberFormField: {
    "& .MuiOutlinedInput-root": {
      minHeight: 52,
      borderRadius: "13px",
      backgroundColor: colors.background.surface,
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

    "& .MuiInputLabel-root": {
      fontSize: 14,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.brand.primary,
    },

    "& .MuiFormHelperText-root": {
      mx: 0.25,
      mt: 0.65,
      fontSize: 11.5,
    },
  },

  memberFormActions: {
    display: "flex",
    flexDirection: {
      xs: "column-reverse",
      sm: "row",
    },
    justifyContent: "flex-end",
    gap: 1,
    px: {
      xs: 2,
      sm: 3,
    },
    py: 2,
    borderTop: `1px solid ${colors.border.default}`,
    backgroundColor: alpha(colors.background.soft, 0.5),

    "& > :not(style) ~ :not(style)": {
      ml: 0,
    },
  },

  memberFormCancelButton: {
    width: {
      xs: "100%",
      sm: "auto",
    },
    minHeight: 44,
    px: 2.25,
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 700,
    color: colors.text.secondary,
  },

  memberFormSubmitButton: {
    width: {
      xs: "100%",
      sm: "auto",
    },
    minHeight: 44,
    px: 2.5,
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 750,
    boxShadow: `0 10px 22px ${alpha(colors.brand.primary, 0.18)}`,
  },

  /* =========================================================
     MODAL DE CAMBIO DE ESTADO
  ========================================================= */

  memberStatusDialog: {
    width: {
      xs: "calc(100% - 24px)",
      sm: "100%",
    },
    m: {
      xs: 1.5,
      sm: 4,
    },
    overflow: "hidden",
    borderRadius: "22px",
    border: `1px solid ${colors.border.default}`,
    boxShadow: dialogShadow,
  },

  statusOptionsGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(3, minmax(0, 1fr))",
    },
    gap: 1,
    mt: 1.5,
  },

  statusOption: (isSelected: boolean, color: string) => ({
    minHeight: 116,
    p: 1.5,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 1,
    borderRadius: "14px",
    border: `1px solid ${isSelected ? color : colors.border.default}`,
    backgroundColor: isSelected
      ? alpha(color, 0.075)
      : colors.background.surface,
    boxShadow: isSelected ? `0 0 0 3px ${alpha(color, 0.1)}` : "none",
    cursor: "pointer",
    textAlign: "left",
    transition:
      "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",

    "&:hover": {
      borderColor: color,
      backgroundColor: alpha(color, 0.05),
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(color, 0.18)}`,
      outlineOffset: 2,
    },
  }),

  statusOptionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
  },

  statusOptionDot: (color: string) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: color,
    boxShadow: `0 0 0 4px ${alpha(color, 0.12)}`,
  }),

  statusOptionTitle: {
    fontSize: 13.5,
    fontWeight: 700,
    color: colors.text.primary,
  },

  statusOptionDescription: {
    fontSize: 11.8,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  statusWarning: {
    mt: 2,
    borderRadius: "14px",
  },

  /* =========================================================
     MODAL DE FILTROS
  ========================================================= */

  filtersDialog: {
    width: {
      xs: "calc(100% - 24px)",
      sm: "100%",
    },
    m: {
      xs: 1.5,
      sm: 4,
    },
    overflow: "hidden",
    borderRadius: "22px",
    border: `1px solid ${colors.border.default}`,
    boxShadow: dialogShadow,
  },

  filtersContent: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
    },
    gap: 1.5,
    px: {
      xs: 2,
      sm: 3,
    },
    py: 2.5,
  },

  filterField: {
    width: "100%",

    "& .MuiOutlinedInput-root": {
      minHeight: 50,
      borderRadius: "13px",
      backgroundColor: colors.background.surface,
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
  },

  /* =========================================================
     CONFIRMACIÓN DE DESCARTE
  ========================================================= */

  memberDiscardDialog: {
    borderRadius: "18px",
    border: `1px solid ${colors.border.default}`,
    boxShadow: dialogShadow,
  },

  memberDiscardContent: {
    px: 3,
    pt: 1,
    pb: 2,
  },

  memberDiscardActions: {
    px: 3,
    pb: 3,
    gap: 1,

    "& > :not(style) ~ :not(style)": {
      ml: 0,
    },
  },

  /* =========================================================
     DETALLE MOBILE
  ========================================================= */

  mobileDetailDialog: {
    display: {
      xs: "block",
      lg: "none",
    },

    "& .MuiDialog-paper": {
      width: "100%",
      maxWidth: "100%",
      height: "100%",
      maxHeight: "100%",
      m: 0,
      borderRadius: 0,
      backgroundColor: colors.background.app,
    },
  },

  mobileDetailHeader: {
    minHeight: 68,
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 1.5,
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.surface,
  },

  mobileDetailBackButton: {
    width: 42,
    height: 42,
    color: colors.text.primary,
  },

  mobileDetailBody: {
    p: 1.5,
  },
};
