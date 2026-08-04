import { alpha } from "@mui/material/styles";

import { colors } from "@/theme/colors";

/*
Estilos completos del módulo administrativo de Proveedores.

Criterios:
- identidad visual real de Green Acres;
- referencia directa del módulo Socios;
- patrón Master / Detail;
- responsive sin alterar la experiencia desktop;
- bordes, sombras y densidad consistentes;
- reutilización en listado, detalle y modales;
- sin colores ajenos al Design System.
*/

const panelShadow = "0 18px 46px rgba(24, 42, 32, 0.065)";
const detailShadow = "0 20px 50px rgba(24, 42, 32, 0.075)";
const dialogShadow = "0 28px 80px rgba(15, 39, 27, 0.18)";

const neutralStrong = alpha(colors.text.primary, 0.82);
const neutralSecondary = alpha(colors.text.primary, 0.64);
const neutralLabel = alpha(colors.text.primary, 0.68);
const neutralBorder = alpha(colors.text.primary, 0.11);

const selectedSurface = alpha(colors.brand.primary, 0.065);

const providerTableColumns =
  "minmax(180px, 1.3fr) minmax(110px, 0.75fr) minmax(100px, 0.65fr) minmax(170px, 1fr) minmax(72px, 0.45fr)";

export const providersStyles = {
  /* =========================================================
     ESTRUCTURA GENERAL
  ========================================================= */

  page: {
    width: "100%",
    minWidth: 0,
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

  headingRow: {
    width: "100%",
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

  headingContent: {
    minWidth: 0,
  },

  pageTitle: {
    fontSize: {
      xs: 22,
      sm: 25,
    },
    fontWeight: 750,
    letterSpacing: "-0.035em",
    color: colors.text.primary,
    lineHeight: 1.15,
  },

  pageSubtitle: {
    mt: 0.7,
    fontSize: {
      xs: 13.5,
      sm: 14.25,
    },
    fontWeight: 400,
    color: neutralSecondary,
    lineHeight: 1.5,
  },

  toolbar: {
    width: {
      xs: "100%",
      xl: "auto",
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "minmax(260px, 1fr) auto auto",
    },
    alignItems: "center",
    gap: 1,
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

  filterButton: {
    position: "relative",
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
    minWidth: 20,
    height: 20,
    ml: 0.8,
    px: 0.65,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    fontSize: 10.5,
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
    boxShadow: `0 10px 22px ${alpha(colors.brand.primary, 0.18)}`,

    "&:hover": {
      boxShadow: `0 12px 26px ${alpha(colors.brand.primary, 0.24)}`,
    },
  },

  alert: {
    borderRadius: "14px",
    border: `1px solid ${alpha(colors.state.error, 0.18)}`,
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
      xl: "minmax(0, 1.08fr) minmax(430px, 0.92fr)",
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
      xs: 540,
      md: 650,
      xl: 690,
    },
  },

  detailPanel: {
    minHeight: {
      xs: 500,
      lg: 650,
      xl: 690,
    },
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
    whiteSpace: "nowrap",
  },

  /* =========================================================
     TABLA / LISTADO
  ========================================================= */

  tableViewport: {
    width: "100%",
    flex: 1,
    overflowX: "auto",
  },

  providersTable: {
    minWidth: {
      xs: "100%",
      md: 720,
    },
  },

  tableHeader: {
    display: {
      xs: "none",
      md: "grid",
    },
    gridTemplateColumns: providerTableColumns,
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

  providersList: {
    display: "flex",
    flexDirection: "column",
  },

  providerRow: (isSelected: boolean) => ({
    position: "relative",
    width: "100%",
    minHeight: {
      xs: 100,
      md: 82,
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      md: providerTableColumns,
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
    backgroundColor: isSelected
      ? selectedSurface
      : colors.background.surface,
    cursor: "pointer",
    textAlign: "left",
    transition: "background-color 160ms ease, box-shadow 160ms ease",

    "&::before": {
      content: '""',
      position: "absolute",
      inset: "0 auto 0 0",
      width: 4,
      borderRadius: "0 5px 5px 0",
      backgroundColor: isSelected
        ? colors.brand.primary
        : "transparent",
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

  providerIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 1.45,
    minWidth: 0,
  },

  providerAvatar: {
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

  inactiveProviderAvatar: {
    backgroundColor: alpha(colors.state.error, 0.08),
    color: colors.state.error,
    borderColor: alpha(colors.state.error, 0.16),
  },

  providerMainData: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 0.3,
  },

  providerName: {
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

  providerId: {
    display: "block",
    width: "100%",
    fontSize: {
      xs: 11.75,
      md: 12.1,
    },
    fontWeight: 450,
    color: neutralSecondary,
    lineHeight: 1.35,
  },

  providerCell: {
    minWidth: 0,
    fontSize: {
      md: 13,
      xl: 13.25,
    },
    fontWeight: 500,
    color: neutralSecondary,
    lineHeight: 1.4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  providerEmailCell: {
    minWidth: 0,
    fontSize: {
      md: 12.5,
      xl: 13,
    },
    fontWeight: 450,
    color: neutralSecondary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  statusChip: (status: "ACTIVO" | "INACTIVO") => ({
    height: 27,
    borderRadius: "9px",
    fontSize: 11.5,
    fontWeight: 650,
    color:
      status === "ACTIVO"
        ? colors.state.success
        : colors.state.error,
    backgroundColor:
      status === "ACTIVO"
        ? alpha(colors.state.success, 0.1)
        : alpha(colors.state.error, 0.09),
    border: `1px solid ${
      status === "ACTIVO"
        ? alpha(colors.state.success, 0.16)
        : alpha(colors.state.error, 0.14)
    }`,

    "& .MuiChip-label": {
      px: 1.05,
    },
  }),

  mobileProviderMeta: {
    display: {
      xs: "grid",
      md: "none",
    },
    gridTemplateColumns: {
      xs: "repeat(2, minmax(0, 1fr))",
      sm: "repeat(3, minmax(0, 1fr))",
    },
    gap: 1,
    pt: 1.1,
    mt: 0.15,
    borderTop: `1px dashed ${colors.border.default}`,
  },

  mobileProviderMetaItem: {
    minWidth: 0,
  },

  mobileProviderMetaLabel: {
    fontSize: 10.75,
    fontWeight: 650,
    color: neutralLabel,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  mobileProviderMetaValue: {
    mt: 0.25,
    fontSize: 12,
    fontWeight: 600,
    color: colors.text.primary,
    overflowWrap: "anywhere",
  },

  listFooter: {
    minHeight: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
    mt: "auto",
    px: {
      xs: 2,
      sm: 2.5,
    },
    py: 1.5,
    borderTop: `1px solid ${neutralBorder}`,
    backgroundColor: alpha(colors.text.primary, 0.018),
  },

  listFooterText: {
    fontSize: 12.25,
    fontWeight: 450,
    color: neutralSecondary,
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

  mobileDetailHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
    minHeight: 60,
    px: 2,
    borderBottom: `1px solid ${neutralBorder}`,
    backgroundColor: colors.background.surface,
  },

  mobileDetailTitle: {
    fontSize: 16.5,
    fontWeight: 700,
    color: colors.text.primary,
  },

  closeButton: {
    width: 38,
    height: 38,
    color: colors.text.secondary,
    border: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.surface,

    "&:hover": {
      color: colors.text.primary,
      borderColor: colors.border.strong,
      backgroundColor: colors.background.soft,
    },
  },

  detailHero: {
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    alignItems: {
      xs: "stretch",
      sm: "flex-start",
    },
    gap: {
      xs: 1.75,
      sm: 2,
    },
    px: {
      xs: 2,
      sm: 2.75,
    },
    py: {
      xs: 2.4,
      sm: 2.9,
    },
    background: `linear-gradient(135deg, ${colors.background.surface} 0%, ${alpha(
      colors.background.soft,
      0.72,
    )} 100%)`,
    borderBottom: `1px solid ${neutralBorder}`,
  },

  detailIdentityWrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.65,
    minWidth: 0,
    flex: 1,
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

  detailInactiveAvatar: {
    backgroundColor: alpha(colors.state.error, 0.08),
    color: colors.state.error,
    borderColor: alpha(colors.state.error, 0.16),
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
    overflowWrap: "anywhere",
  },

  detailIdentifier: {
    mt: 0.45,
    fontSize: 12.75,
    fontWeight: 450,
    color: neutralSecondary,
  },

  detailStatusRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.65,
    mt: 1.1,
  },

  detailActions: {
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    flexWrap: "wrap",
    alignItems: "stretch",
    justifyContent: {
      xs: "stretch",
      sm: "flex-end",
    },
    gap: 0.85,
  },

  detailActionButton: {
    minHeight: 42,
    px: 1.85,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.25,
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
    px: {
      xs: 2,
      sm: 2.75,
    },
    py: {
      xs: 2.25,
      sm: 2.55,
    },
    borderBottom: `1px solid ${neutralBorder}`,

    "&:last-of-type": {
      borderBottom: 0,
    },
  },

  detailSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 0.8,
    mb: 1.7,
  },

  detailSectionIcon: {
    width: 30,
    height: 30,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "9px",
    color: colors.brand.primary,
    backgroundColor: colors.background.soft,

    "& svg": {
      fontSize: 17,
    },
  },

  detailSectionTitle: {
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
    },
    columnGap: 3,
    rowGap: 2,
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
    mt: 0.5,
    minWidth: 0,
  },

  detailValueIcon: {
    fontSize: 16,
    color: neutralLabel,
    flexShrink: 0,
  },

  detailValue: {
    minWidth: 0,
    fontSize: 13.25,
    fontWeight: 500,
    color: neutralStrong,
    lineHeight: 1.45,
    overflowWrap: "anywhere",
  },

  statusInformationBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.1,
    p: 1.75,
    borderRadius: "14px",
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primary, 0.055),
    border: `1px solid ${alpha(colors.brand.primary, 0.13)}`,
  },

  statusInformationIcon: {
    fontSize: 20,
    color: colors.brand.primary,
    flexShrink: 0,
    mt: 0.1,
  },

  statusInformationText: {
    fontSize: 12.75,
    fontWeight: 450,
    color: neutralSecondary,
    lineHeight: 1.55,
  },

  /* =========================================================
     ESTADOS DE INTERFAZ
  ========================================================= */

  loadingState: {
    minHeight: 420,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1.5,
    borderRadius: "20px",
    border: `1px solid ${neutralBorder}`,
    backgroundColor: colors.background.surface,
    boxShadow: panelShadow,
  },

  loadingText: {
    fontSize: 13.5,
    fontWeight: 500,
    color: neutralSecondary,
  },

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

    "& svg": {
      fontSize: 28,
    },
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

  feedbackAlert: {
    borderRadius: "14px",
    border: `1px solid ${colors.border.default}`,
    fontWeight: 650,
  },

  /* =========================================================
     DIÁLOGOS Y MODALES
  ========================================================= */

  modalPaper: {
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

  modalHeader: {
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

  modalHeaderContent: {
    minWidth: 0,
  },

  modalTitle: {
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

  modalSubtitle: {
    mt: 0.7,
    maxWidth: 560,
    fontSize: 13.5,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  modalCloseButton: {
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

  modalContent: {
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

  modalError: {
    mb: 2,
    borderRadius: "13px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
    },
    gap: 2,
  },

  fullWidthField: {
    gridColumn: {
      xs: "auto",
      sm: "1 / -1",
    },
  },

  formField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: colors.background.surface,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },

    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.strong,
    },

    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.brand.primary,
    },

    "& .MuiFormLabel-root.Mui-focused": {
      color: colors.brand.primary,
    },

    "& .MuiFormHelperText-root": {
      mx: 0.25,
      mt: 0.6,
      fontSize: 11.5,
    },
  },

  formInformationBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.1,
    mt: 2.25,
    p: 1.7,
    borderRadius: "14px",
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primary, 0.055),
    border: `1px solid ${alpha(colors.brand.primary, 0.13)}`,
  },

  formInformationIcon: {
    fontSize: 20,
    flexShrink: 0,
    color: colors.brand.primary,
    mt: 0.1,
  },

  formInformationText: {
    fontSize: 12.75,
    fontWeight: 450,
    color: neutralSecondary,
    lineHeight: 1.5,
  },

  modalActions: {
    display: "flex",
    flexDirection: {
      xs: "column-reverse",
      sm: "row",
    },
    alignItems: "stretch",
    justifyContent: "flex-end",
    gap: 1,
    px: {
      xs: 2,
      sm: 3,
    },
    py: {
      xs: 2,
      sm: 2.25,
    },
    borderTop: `1px solid ${colors.border.default}`,
    backgroundColor: alpha(colors.background.soft, 0.5),
  },

  cancelButton: {
    minHeight: 44,
    px: 2.2,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 650,
    color: colors.text.secondary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,

    "&:hover": {
      color: colors.text.primary,
      borderColor: colors.border.strong,
      backgroundColor: colors.background.soft,
    },
  },

  submitButton: {
    minHeight: 44,
    px: 2.35,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 700,
    boxShadow: `0 9px 20px ${alpha(colors.brand.primary, 0.16)}`,

    "&:hover": {
      boxShadow: `0 11px 24px ${alpha(colors.brand.primary, 0.22)}`,
    },
  },

  dangerButton: {
    minHeight: 44,
    px: 2.35,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 700,
    color: colors.text.inverse,
    backgroundColor: colors.state.error,
    boxShadow: `0 9px 20px ${alpha(colors.state.error, 0.16)}`,

    "&:hover": {
      backgroundColor: "#8F1C13",
      boxShadow: `0 11px 24px ${alpha(colors.state.error, 0.22)}`,
    },
  },

  /* =========================================================
     MODAL DE FILTROS
  ========================================================= */

  filterOptions: {
    display: "grid",
    gap: 1,
  },

  filterOption: (selected: boolean) => ({
    width: "100%",
    minHeight: 54,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
    px: 1.75,
    py: 1.3,
    borderRadius: "13px",
    border: `1px solid ${
      selected
        ? alpha(colors.brand.primary, 0.38)
        : colors.border.default
    }`,
    color: colors.text.primary,
    backgroundColor: selected
      ? alpha(colors.brand.primary, 0.065)
      : colors.background.surface,
    cursor: "pointer",
    textAlign: "left",
    transition:
      "border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease",

    "&:hover": {
      borderColor: colors.brand.primary,
      backgroundColor: alpha(colors.brand.primary, 0.045),
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.brand.primary, 0.17)}`,
      outlineOffset: 2,
    },
  }),

  filterOptionText: {
    minWidth: 0,
  },

  filterOptionTitle: {
    fontSize: 13.5,
    fontWeight: 650,
    color: colors.text.primary,
  },

  filterOptionDescription: {
    mt: 0.25,
    fontSize: 12.25,
    fontWeight: 400,
    color: neutralSecondary,
    lineHeight: 1.4,
  },

  filterOptionIndicator: (selected: boolean) => ({
    width: 20,
    height: 20,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    border: `1.5px solid ${
      selected ? colors.brand.primary : colors.border.strong
    }`,
    backgroundColor: selected
      ? colors.brand.primary
      : colors.background.surface,

    "&::after": {
      content: '""',
      width: 6,
      height: 6,
      borderRadius: "50%",
      backgroundColor: selected
        ? colors.text.inverse
        : "transparent",
    },
  }),

  /* =========================================================
     MODAL DE CAMBIO DE ESTADO
  ========================================================= */

  statusSummary: {
    display: "flex",
    alignItems: "center",
    gap: 1.35,
    p: 1.75,
    mb: 2,
    borderRadius: "15px",
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  statusSummaryAvatar: {
    width: 48,
    height: 48,
    flexShrink: 0,
    backgroundColor: colors.brand.primaryLight,
    color: colors.brand.primaryDark,
    border: `1px solid ${alpha(colors.brand.primary, 0.15)}`,
    fontSize: 14,
    fontWeight: 700,
  },

  statusSummaryContent: {
    minWidth: 0,
    flex: 1,
  },

  statusSummaryName: {
    fontSize: 14.25,
    fontWeight: 700,
    color: colors.text.primary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  statusSummaryMeta: {
    mt: 0.3,
    fontSize: 12.25,
    fontWeight: 450,
    color: neutralSecondary,
  },

  statusWarning: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    p: 1.6,
    borderRadius: "14px",
    color: colors.state.warning,
    backgroundColor: alpha(colors.state.warning, 0.07),
    border: `1px solid ${alpha(colors.state.warning, 0.2)}`,

    "& svg": {
      flexShrink: 0,
      fontSize: 20,
      mt: 0.1,
    },
  },

  statusWarningText: {
    fontSize: 12.75,
    fontWeight: 450,
    color: neutralStrong,
    lineHeight: 1.5,
  },

  /* =========================================================
     DETALLE MOBILE
  ========================================================= */

  mobileDialogContent: {
    p: 0,
    minHeight: "100%",
    backgroundColor: colors.background.app,
  },
};