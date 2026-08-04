import { colors } from "@/theme/colors";

/*
Estilos del módulo Ventas.

Criterios:
- mobile first;
- separación visual premium por secciones;
- uso de tokens globales de color;
- layout compacto, moderno y profesional;
- sin tocar drawer ni AdminLayout.
*/

const panelShadow = "0 18px 40px rgba(16, 41, 28, 0.055)";
const sectionShadow = "0 10px 28px rgba(16, 41, 28, 0.035)";
const subtleGreen = "#F7FCF8";
const subtleWarning = "#FFF9EE";
const softError = "#FDE8E6";

/*
Columnas del historial de ventas.

Se centralizan para que encabezado y filas usen exactamente
la misma estructura visual, evitando desfasajes entre títulos
y contenido.
*/
const salesHistoryColumns =
  "minmax(150px, 1.2fr) minmax(150px, 1.05fr) minmax(78px, 0.65fr) minmax(90px, 0.7fr) minmax(122px, 0.85fr) minmax(142px, 0.95fr)";

export const salesStyles = {
  root: {
    width: "100%",
  },

  contentGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
    gap: 2.5,
    alignItems: "start",
  },

  mainPanel: {
    borderRadius: "22px",
    p: { xs: 2, md: 2.5 },
    bgcolor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  historyPanel: {
    borderRadius: "22px",
    p: { xs: 2, md: 2.5 },
    bgcolor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  panelHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1.15,
    mb: 1.65,
  },

  panelHeaderCompact: {
    display: "flex",
    alignItems: "center",
    gap: 1.15,
    minWidth: 0,
  },

  panelIcon: {
    width: 38,
    height: 38,
    borderRadius: "11px",
    display: "grid",
    placeItems: "center",
    bgcolor: colors.background.soft,
    color: colors.brand.primary,
    border: `1px solid ${colors.border.default}`,
    flexShrink: 0,
  },

  panelTitle: {
    fontSize: {
      xs: 17.5,
      md: 18.5,
    },
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.2,
    letterSpacing: "-0.018em",
  },

  panelSubtitle: {
    mt: 0.3,
    fontSize: {
      xs: 12.5,
      md: 13,
    },
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  stepsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 1.25,
  },

  memberStep: {
    borderRadius: "17px",
    p: { xs: 1.05, md: 1.1 },
    border: `1px solid ${colors.border.default}`,
    bgcolor: subtleGreen,
    boxShadow: sectionShadow,
  },

  productsStep: {
    borderRadius: "17px",
    p: { xs: 1.25, md: 1.4 },
    border: "1px solid #E4EDF7",
    bgcolor: "#F5F9FF",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
  },

  summaryStep: {
    borderRadius: "17px",
    p: { xs: 1.2, md: 1.35 },
    border: "1px solid #F1D9A8",
    bgcolor: subtleWarning,
    boxShadow: sectionShadow,
  },

  stepHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 0.85,
  },

  stepHeaderNoMargin: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },

  stepNumber: {
    width: 27,
    height: 27,
    borderRadius: "8px",
    bgcolor: colors.brand.primary,
    color: colors.text.inverse,
    fontWeight: 700,
    display: "grid",
    placeItems: "center",
    fontSize: 12.5,
    flexShrink: 0,
    boxShadow: "0 6px 12px rgba(47, 111, 70, 0.14)",
  },

  stepNumberBlue: {
    width: 27,
    height: 27,
    borderRadius: "8px",
    bgcolor: "#2F7FD0",
    color: colors.text.inverse,
    fontWeight: 700,
    display: "grid",
    placeItems: "center",
    fontSize: 12.5,
    flexShrink: 0,
    boxShadow: "0 4px 10px rgba(47, 127, 208, 0.10)",
  },

  stepNumberOrange: {
    width: 27,
    height: 27,
    borderRadius: "8px",
    bgcolor: colors.state.warning,
    color: colors.text.inverse,
    fontWeight: 700,
    display: "grid",
    placeItems: "center",
    fontSize: 12.5,
    flexShrink: 0,
    boxShadow: "0 6px 12px rgba(197, 138, 31, 0.14)",
  },

  memberStepIcon: {
    color: colors.brand.primary,
    fontSize: 19,
  },

  flowerStepIcon: {
    color: "#4B84C4",
    fontSize: 18,
  },

  summaryStepIcon: {
    color: colors.state.warning,
    fontSize: 19,
  },

  stepTitle: {
    fontSize: {
      xs: 14.25,
      md: 14.75,
    },
    fontWeight: 700,
    color: colors.text.primary,
    letterSpacing: "-0.008em",
    lineHeight: 1.3,
  },

  memberGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 0.82fr" },
    gap: 1.55,
    alignItems: "start",
    mt: 0,
    maxWidth: 940,
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr 0.65fr",
      md: "1.2fr 0.58fr 0.7fr auto",
    },
    gap: 0.9,
    alignItems: "end",
    mt: 0.15,
    mb: 0.8,
  },

  inputLabel: {
    display: "block",
    mb: 0.45,
    fontSize: 11.75,
    fontWeight: 650,
    color: colors.text.secondary,
    lineHeight: 1.25,
  },

  memberSelect: {
    borderRadius: "12px",
    bgcolor: colors.background.surface,
    minHeight: 58,

    "& .MuiSelect-select": {
      py: 1.1,
      minHeight: "36px",
      display: "flex",
      alignItems: "center",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.strong,
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.brand.primary,
      borderWidth: 1.5,
    },
  },

  productSelect: {
    borderRadius: "14px",
    bgcolor: colors.background.surface,
    minHeight: 48,

    "& .MuiSelect-select": {
      py: 0.9,
      minHeight: "30px",
      display: "flex",
      alignItems: "center",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.strong,
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.brand.primary,
      borderWidth: 1.5,
    },
  },

  input: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      bgcolor: colors.background.surface,
      minHeight: 48,
    },

    "& .MuiInputBase-input": {
      py: 1,
      fontSize: 13.5,
      fontWeight: 500,
      color: colors.text.primary,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.strong,
    },

    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.brand.primary,
      borderWidth: 1.5,
    },
  },

  memberOption: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    gap: 1.05,
  },

  productOption: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
    gap: 1.15,
  },

  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    bgcolor: colors.background.soft,
    color: colors.text.secondary,
    border: `1px solid ${colors.border.default}`,
    flexShrink: 0,
  },

  optionText: {
    minWidth: 0,
  },

  optionPrimary: {
    fontSize: 13.5,
    fontWeight: 650,
    color: colors.text.primary,
    lineHeight: 1.25,
  },

  optionSecondary: {
    mt: 0.2,
    fontSize: 12,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.35,
  },

  activeChip: {
    height: 24,
    bgcolor: colors.brand.primaryLight,
    color: colors.brand.primaryDark,
    fontSize: 10.75,
    fontWeight: 650,
    borderRadius: "8px",

    "& .MuiChip-label": {
      px: 1,
    },
  },

  consumptionCard: {
    borderRadius: "12px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.surface,
    p: 0.85,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  consumptionValueRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 0.6,
    mt: 0.2,
    mb: 0.55,
  },

  consumptionValue: {
    fontSize: {
      xs: 21,
      md: 22,
    },
    fontWeight: 750,
    color: colors.text.primary,
    letterSpacing: "-0.025em",
    lineHeight: 1,
  },

  limitText: {
    fontSize: 13,
    fontWeight: 500,
    color: colors.text.secondary,
  },

  progressRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: 0.8,
    mb: 0.55,
  },

  progressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 999,
    bgcolor: colors.border.default,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: 999,
    bgcolor: colors.brand.primary,
  },

  progressPercentage: {
    fontSize: 11.5,
    fontWeight: 650,
    color: colors.text.secondary,
  },

  mutedText: {
    fontSize: 12.25,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  productVisual: {
    width: 38,
    height: 38,
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    bgcolor: "#EEF6E9",
    border: `1px solid ${colors.border.default}`,
    flexShrink: 0,
    boxShadow:
      "inset 0 0 0 3px rgba(255,255,255,0.58), 0 3px 8px rgba(16,41,28,0.06)",
  },

  productVisualCompact: {
    width: 30,
    height: 30,
    borderRadius: "10px",
    display: "grid",
    placeItems: "center",
    bgcolor: "#EEF6E9",
    border: `1px solid ${colors.border.default}`,
    flexShrink: 0,
    boxShadow:
      "inset 0 0 0 2px rgba(255,255,255,0.58), 0 2px 6px rgba(16,41,28,0.05)",
  },

  stockBox: {
    minHeight: 48,
    borderRadius: "12px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.surface,
    px: 1.25,
    py: 0.7,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  stockValue: {
    fontSize: 15,
    fontWeight: 700,
    color: colors.state.success,
    lineHeight: 1.2,
  },

  addButton: {
    minHeight: 48,
    borderRadius: "12px",
    px: 1.8,
    bgcolor: colors.brand.primary,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: "0 5px 12px rgba(47, 111, 70, 0.12)",

    "&:hover": {
      bgcolor: colors.brand.primaryDark,
      boxShadow: "0 7px 16px rgba(47, 111, 70, 0.16)",
    },
  },

  detailsTable: {
    borderRadius: "14px",
    overflow: "hidden",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.surface,
  },

  tableHeader: {
    display: { xs: "none", md: "grid" },
    gridTemplateColumns: "1.3fr 0.45fr 0.72fr 0.82fr 0.82fr 0.5fr",
    alignItems: "center",
    minHeight: 42,
    px: 1.45,
    py: 0.65,
    bgcolor: "rgba(16, 41, 28, 0.025)",
    borderBottom: `1px solid ${colors.border.default}`,

    "& .MuiTypography-root": {
      fontSize: 11.25,
      fontWeight: 700,
      color: colors.text.secondary,
      textTransform: "uppercase",
      letterSpacing: "0.055em",
      lineHeight: 1.2,
    },
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr auto",
      md: "1.3fr 0.45fr 0.72fr 0.82fr 0.82fr 0.5fr",
    },
    gap: { xs: 1, md: 0 },
    alignItems: "center",
    px: 1.45,
    py: 0.9,
    borderTop: `1px solid ${colors.border.default}`,

    "& .MuiTypography-root": {
      fontSize: 13,
      fontWeight: 500,
      color: colors.text.secondary,
      lineHeight: 1.35,
    },
  },

  tableProductCell: {
    display: "flex",
    alignItems: "center",
    gap: 0.9,
  },

  productName: {
    fontSize: 13.25,
    fontWeight: 650,
    color: `${colors.text.primary} !important`,
  },

  subtotalText: {
    fontSize: 13.25,
    fontWeight: 700,
    color: `${colors.text.primary} !important`,
  },

  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: "12px",
    color: colors.state.error,
    justifySelf: "center",

    "&:hover": {
      bgcolor: "rgba(239, 68, 68, 0.08)",
    },
  },

  summaryTop: {
    display: "flex",
    flexDirection: "column",
    gap: 0.65,
  },
  summaryIntroText: {
    fontSize: 13,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  summaryMetricsGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "360px 360px",
    },
    justifyContent: "start",
    gap: 1,
    mb: 1,
  },

  summaryMetricCard: {
    minHeight: 78,
    borderRadius: "14px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.surface,
    px: 1.5,
    py: 1,
    display: "flex",
    alignItems: "center",
    gap: 1.25,
  },

  summaryMetricIcon: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    bgcolor: "#FFF5E9",
    color: colors.state.warning,
    display: "grid",
    placeItems: "center",

    "& svg": {
      fontSize: 24,
    },
  },

  summaryMetricIconGreen: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    bgcolor: "#F3FAF5",
    display: "grid",
    placeItems: "center",
  },

  summaryCurrencyIcon: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.state.success,
    lineHeight: 1,
  },

  summaryMetricContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  summaryMetricLabel: {
    mb: 0.25,
    fontSize: 11.5,
    fontWeight: 650,
    color: colors.text.secondary,
    lineHeight: 1.25,
  },

  summaryMetricValueOrange: {
    fontSize: {
      xs: 21,
      md: 22,
    },
    fontWeight: 750,
    color: colors.state.warning,
    letterSpacing: "-0.02em",
    lineHeight: 1,
  },

  summaryMetricValueGreen: {
    fontSize: {
      xs: 21,
      md: 22,
    },
    fontWeight: 750,
    color: colors.state.success,
    letterSpacing: "-0.02em",
    lineHeight: 1,
  },

  summaryMetricHint: {
    mt: 0.45,
    fontSize: 12,
    color: colors.text.secondary,
  },

  summaryStatusPill: {
    mt: 0.55,
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    px: 1,
    py: 0.35,
    borderRadius: "999px",
    bgcolor: "#F1FAF3",
  },

  summaryStatusIcon: {
    fontSize: 14,
    color: colors.state.success,
  },

  summaryStatusText: {
    fontSize: 11.5,
    fontWeight: 650,
    color: colors.state.success,
  },

  observationsHeader: {
    display: "block",
    mb: 0.65,
    fontSize: 12.5,
    fontWeight: 650,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  summaryHeader: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
    gap: 1.4,
    alignItems: "center",
    mb: 1.05,
  },

  summaryTitleArea: {
    display: "flex",
    alignItems: "center",
    gap: 1.15,
    flexWrap: "wrap",
  },

  compactGramsPill: {
    minHeight: 42,
    borderRadius: "14px",
    border: "1px solid #F2DDAE",
    bgcolor: colors.background.surface,
    px: 1.15,
    py: 0.75,
    display: "flex",
    alignItems: "center",
    gap: 0.85,
  },

  compactGramsIcon: {
    color: colors.state.warning,
    fontSize: 21,
  },

  compactGramsValue: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.state.warning,
    lineHeight: 1,
  },

  totalBox: {
    textAlign: { xs: "left", sm: "right" },
  },

  totalAmount: {
    fontSize: {
      xs: 25,
      md: 28,
    },
    fontWeight: 750,
    color: colors.brand.primaryDark,
    letterSpacing: "-0.03em",
    lineHeight: 1,
  },

  divider: {
    my: 0.9,
    borderColor: "#EADDBF",
  },

  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 1.25,
    alignItems: "stretch",
  },

  observationsInput: {
    width: "100%",
    mb: 0.85,

    "& .MuiOutlinedInput-root": {
      height: 82,
      borderRadius: "14px",
      bgcolor: colors.background.surface,
      alignItems: "flex-start",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },

    "& textarea": {
      height: "100% !important",
      maxHeight: "52px !important",
      overflow: "auto !important",
      fontSize: 13,
      lineHeight: 1.4,
    },
  },

  actionsBox: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 1.25,
    flexWrap: "wrap",
    width: "100%",

    "& .MuiButton-root": {
      minHeight: 50,
      whiteSpace: "nowrap",
    },
  },

  clearButton: {
    borderRadius: "14px",
    px: 2.75,
    textTransform: "none",
    fontWeight: 700,
    borderColor: colors.border.default,
    color: colors.text.primary,
    bgcolor: colors.background.surface,

    "&:hover": {
      borderColor: colors.border.strong,
      bgcolor: colors.background.soft,
    },
  },

  confirmButton: {
    borderRadius: "14px",
    px: 3,
    textTransform: "none",
    fontWeight: 700,
    bgcolor: colors.brand.primary,
    boxShadow: "0 10px 22px rgba(47,111,70,0.18)",

    "&:hover": {
      bgcolor: colors.brand.primaryDark,
      boxShadow: "0 12px 26px rgba(47,111,70,0.22)",
    },

    "&.Mui-disabled": {
      bgcolor: colors.state.disabled,
      color: colors.text.inverse,
      boxShadow: "none",
    },
  },

  historyHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    mb: 2.2,
  },

  filterButton: {
    borderRadius: "14px",
    minHeight: 42,
    px: 1.85,
    textTransform: "none",
    fontWeight: 700,
    color: colors.text.primary,
    borderColor: colors.border.default,
    bgcolor: colors.background.surface,

    "&:hover": {
      borderColor: colors.border.strong,
      bgcolor: colors.background.soft,
    },
  },

  searchInput: {
    mb: 2,

    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      bgcolor: colors.background.surface,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },
  },

  salesList: {
    border: `1px solid ${colors.border.default}`,
    borderRadius: "18px",
    overflow: "hidden",
    bgcolor: colors.background.surface,
  },

  salesTableHeader: {
    display: {
      xs: "none",
      md: "grid",
    },
    gridTemplateColumns: salesHistoryColumns,
    alignItems: "center",
    minHeight: 48,
    px: 2.2,
    py: 0.9,
    bgcolor: "rgba(16, 41, 28, 0.025)",
    borderBottom: `1px solid ${colors.border.default}`,

    "& .MuiTypography-root": {
      minWidth: 0,
      fontSize: 11.25,
      fontWeight: 700,
      color: colors.text.secondary,
      textTransform: "uppercase",
      letterSpacing: "0.055em",
      lineHeight: 1.2,
      whiteSpace: "nowrap",
    },

    "& > :nth-child(3), & > :nth-child(4), & > :nth-child(5)": {
      justifySelf: "center",
      textAlign: "center",
    },

    "& > :nth-child(6)": {
      justifySelf: "start",
      textAlign: "left",
    },
  },
  salesTableBody: {
    display: "flex",
    flexDirection: "column",
  },

  saleRow: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: salesHistoryColumns,
    },
    alignItems: "center",
    px: 2.2,
    py: 1.45,
    borderBottom: `1px solid ${colors.border.default}`,
    transition: "background-color 160ms ease",

    "& > *": {
      minWidth: 0,
    },

    "& > :nth-child(3), & > :nth-child(4), & > :nth-child(5)": {
      justifySelf: "center",
      textAlign: "center",
    },

    "& > :nth-child(6)": {
      justifySelf: "stretch",
    },

    "&:hover": {
      bgcolor: "#FAFCFB",
    },

    "&:last-child": {
      borderBottom: "none",
    },
  },

  saleCard: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr 1fr",
      md: "0.9fr 1fr 0.55fr auto auto",
    },
    gap: { xs: 1, md: 1.1 },
    alignItems: "center",

    borderRadius: "14px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.surface,

    px: 1.4,
    py: 1.1,

    boxShadow: "0 4px 12px rgba(16, 41, 28, 0.025)",
  },

  saleMainInfo: {
    minWidth: 0,
  },

  saleCode: {
    fontSize: 14.25,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  saleDate: {
    display: "flex",
    alignItems: "flex-start",
    gap: 0.5,
    mt: 0.25,
    fontSize: 12,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.35,
    whiteSpace: "normal",
    overflowWrap: "anywhere",
  },

  inlineIcon: {
    mt: "2px",
    fontSize: 15,
    color: colors.text.muted,
    flexShrink: 0,
  },

  saleMember: {
    fontSize: 14,
    fontWeight: 650,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  saleGrams: {
    fontSize: 13.25,
    fontWeight: 600,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  saleQuantity: {
    fontSize: 13.25,
    fontWeight: 600,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  saleTotal: {
    fontSize: 13.75,
    fontWeight: 700,
    color: colors.text.primary,
    letterSpacing: "-0.005em",
    lineHeight: 1.3,
  },

  registeredChip: {
    height: 27,
    maxWidth: 118,
    justifySelf: "start",
    bgcolor: colors.brand.primaryLight,
    color: colors.brand.primaryDark,
    fontWeight: 650,
    borderRadius: "9px",

    "& .MuiChip-label": {
      px: 1.15,
      fontSize: 11.5,
    },
  },

  cancelledChip: {
    height: 27,
    minWidth: 92,
    justifySelf: "start",
    bgcolor: softError,
    color: colors.state.error,
    fontWeight: 650,
    borderRadius: "9px",

    "& .MuiChip-label": {
      px: 1.15,
      fontSize: 11.5,
    },
  },

  saleActions: {
    width: "100%",
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 0.5,
    flexWrap: "nowrap",
  },

  viewButton: {
    width: 38,
    height: 38,
    flexShrink: 0,
    border: `1px solid ${colors.border.default}`,
    color: colors.text.primary,
    transition: "all 160ms ease",

    "&:hover": {
      bgcolor: colors.background.soft,
      transform: "translateY(-1px)",
      borderColor: "#D8E6DD",
    },
  },

  cancelButton: {
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 650,
    color: colors.state.error,
    minWidth: 72,
    flexShrink: 0,
    px: 1,

    "&:hover": {
      bgcolor: softError,
    },
  },

  loadingBox: {
    py: 5,
    display: "grid",
    placeItems: "center",
  },

  emptyBox: {
    borderRadius: "16px",
    border: `1px dashed ${colors.border.strong}`,
    bgcolor: colors.background.soft,
    p: 3,
    textAlign: "center",
  },

  emptyTitle: {
    mb: 0.5,
    fontSize: 15,
    fontWeight: 700,
    color: colors.text.primary,
  },

  /*
  Estilos del modal de detalle de venta.

  Mantienen el mismo lenguaje visual del módulo:
  superficies limpias, bordes suaves, jerarquía clara
  y lectura rápida de información administrativa.

  El diseño prioriza:
  - jerarquía visual equilibrada;
  - información administrativa clara;
  - detalle de productos compacto;
  - trazabilidad explícita del registro de venta;
  - coherencia visual con el resto del módulo.
  */
  saleDetailDialog: {
    borderRadius: { xs: "22px", md: "26px" },
    bgcolor: colors.background.surface,
    boxShadow: "0 30px 90px rgba(16, 41, 28, 0.18)",
    overflow: "hidden",
  },

  saleDetailHeader: {
    px: { xs: 2.25, md: 3.25 },
    py: { xs: 2.15, md: 2.45 },
    borderBottom: `1px solid ${colors.border.default}`,
    bgcolor: subtleGreen,
  },

  saleDetailHeaderContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 2,
  },

  saleDetailEyebrow: {
    fontSize: 11.25,
    fontWeight: 650,
    color: colors.brand.primary,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    mb: 0.35,
  },

  saleDetailTitle: {
    fontSize: {
      xs: 20,
      md: 22,
    },
    fontWeight: 700,
    color: colors.text.primary,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },

  saleDetailSubtitle: {
    mt: 0.45,
    fontSize: 13.25,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  saleDetailContent: {
    px: { xs: 2.25, md: 3.25 },
    py: { xs: 2.25, md: 2.65 },
    bgcolor: colors.background.surface,
  },

  saleDetailBody: {
    display: "grid",
    gap: 2.1,
  },

  saleDetailSummaryGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr 1fr",
      md: "repeat(4, 1fr)",
    },
    gap: 1.25,
  },

  saleDetailInfoCard: {
    borderRadius: "18px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.soft,
    p: 1.55,
    minHeight: 92,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: sectionShadow,
  },

  saleDetailInfoCardFeatured: {
    borderRadius: "18px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.soft,
    p: 1.55,
    minHeight: 92,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: sectionShadow,
  },

  saleDetailLabel: {
    mb: 0.45,
    fontSize: 11.25,
    fontWeight: 650,
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "0.035em",
    lineHeight: 1.25,
  },

  saleDetailValue: {
    fontSize: 13.25,
    fontWeight: 500,
    color: colors.text.primary,
    lineHeight: 1.4,
    wordBreak: "break-word",
  },

  saleDetailValueGreen: {
    fontSize: 13.25,
    fontWeight: 600,
    color: colors.brand.primary,
    lineHeight: 1.4,
    wordBreak: "break-word",
  },

  saleDetailMuted: {
    fontSize: 12.5,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  saleDetailSection: {
    display: "grid",
    gap: 1.1,
  },

  saleDetailSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    flexDirection: { xs: "column", sm: "row" },
    gap: 0.6,
  },

  saleDetailSectionTitle: {
    fontSize: 11.75,
    fontWeight: 700,
    color: colors.brand.primary,
    textTransform: "uppercase",
    letterSpacing: "0.065em",
    lineHeight: 1.2,
  },

  saleDetailSectionHint: {
    fontSize: 12.5,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  saleDetailTable: {
    borderRadius: "18px",
    border: `1px solid ${colors.border.default}`,
    overflow: "hidden",
    bgcolor: colors.background.surface,
    boxShadow: sectionShadow,
  },

  saleDetailTableHeader: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1.45fr 0.65fr 0.85fr 0.9fr 0.9fr",
      md: "1.6fr 0.65fr 0.85fr 0.9fr 0.9fr",
    },
    gap: 1,
    alignItems: "center",
    minHeight: 46,
    px: { xs: 1.35, md: 1.6 },
    py: 0.85,
    bgcolor: "rgba(16, 41, 28, 0.025)",
    borderBottom: `1px solid ${colors.border.default}`,

    "& .MuiTypography-root": {
      fontSize: 11.25,
      fontWeight: 700,
      color: colors.text.secondary,
      textTransform: "uppercase",
      letterSpacing: "0.055em",
      lineHeight: 1.2,
    },
  },

  saleDetailTableRow: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1.45fr 0.65fr 0.85fr 0.9fr 0.9fr",
      md: "1.6fr 0.65fr 0.85fr 0.9fr 0.9fr",
    },
    gap: 1,
    alignItems: "center",
    px: { xs: 1.35, md: 1.6 },
    py: 1.1,
    borderBottom: `1px solid ${colors.border.default}`,
    "&:last-of-type": {
      borderBottom: "none",
    },
  },

  saleDetailProductName: {
    fontSize: 13.5,
    fontWeight: 650,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  saleDetailTableText: {
    fontSize: 13,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.35,
  },

  saleDetailTableTextStrong: {
    fontSize: 13,
    fontWeight: 650,
    color: colors.text.primary,
    lineHeight: 1.35,
  },

  saleDetailFooterGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 280px" },
    gap: 1.25,
    alignItems: "stretch",
  },

  saleDetailObservationBox: {
    borderRadius: "18px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.soft,
    p: 1.55,
    minHeight: 92,
  },

  saleDetailObservationText: {
    fontSize: 13.25,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.5,
  },

  saleDetailTraceBox: {
    borderRadius: "18px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.soft,
    p: 1.55,
    minHeight: 92,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: { xs: "flex-start", md: "flex-end" },
    textAlign: { xs: "left", md: "right" },
  },

  saleDetailTotalBox: {
    borderRadius: "18px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.soft,
    p: 1.55,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: { xs: "flex-start", md: "flex-end" },
  },

  saleDetailTotal: {
    fontSize: {
      xs: 20,
      md: 22,
    },
    fontWeight: 700,
    color: colors.brand.primary,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
  },

  saleDetailActions: {
    px: { xs: 2.25, md: 3.25 },
    py: 1.85,
    borderTop: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.soft,
  },

  saleDetailCloseButton: {
    minWidth: 112,
    borderRadius: "16px",
    px: 2.4,
    py: 1.05,
    bgcolor: colors.background.surface,
    color: colors.text.primary,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: "0 10px 24px rgba(16, 41, 28, 0.05)",

    "&:hover": {
      bgcolor: subtleGreen,
    },
  },

  /* =========================================================
     MODAL DE FILTROS DE VENTAS
  ========================================================= */

  salesFiltersDialog: {
    borderRadius: "24px",
    bgcolor: colors.background.surface,
    boxShadow: "0 30px 90px rgba(16, 41, 28, 0.20)",
    overflow: "hidden",
    width: "100%",
  },

  salesFiltersHeader: {
    px: { xs: 2.25, sm: 3 },
    py: { xs: 2.2, sm: 2.6 },
    borderBottom: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.surface,
  },

  salesFiltersHeaderContent: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 2,
  },

  salesFiltersTitle: {
    fontSize: {
      xs: 22,
      sm: 25,
    },
    fontWeight: 700,
    color: colors.text.primary,
    letterSpacing: "-0.025em",
    lineHeight: 1.15,
  },

  salesFiltersSubtitle: {
    mt: 0.55,
    fontSize: {
      xs: 14,
      sm: 15,
    },
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  salesFiltersCloseButton: {
    width: 44,
    height: 44,
    flexShrink: 0,
    border: `1px solid ${colors.border.default}`,
    color: colors.text.secondary,
    bgcolor: colors.background.surface,

    "&:hover": {
      color: colors.text.primary,
      bgcolor: colors.background.soft,
      borderColor: colors.border.strong,
    },
  },

  salesFiltersContent: {
    px: { xs: 2.25, sm: 3 },
    py: { xs: 2.4, sm: 2.8 },
    bgcolor: colors.background.surface,
  },

  salesFiltersInfoBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.4,
    p: { xs: 1.6, sm: 1.8 },
    mb: { xs: 2.4, sm: 2.8 },
    borderRadius: "18px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.soft,
  },

  salesFiltersInfoIcon: {
    width: 42,
    height: 42,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "13px",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.surface,
    color: colors.brand.primary,
  },

  salesFiltersInfoContent: {
    minWidth: 0,
  },

  salesFiltersInfoTitle: {
    fontSize: 14.5,
    fontWeight: 700,
    color: colors.text.primary,
    lineHeight: 1.3,
  },

  salesFiltersInfoText: {
    mt: 0.3,
    fontSize: 13.5,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  salesFiltersSection: {
    display: "grid",
    gap: 1,
  },

  salesFiltersSectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.brand.primary,
    textTransform: "uppercase",
    letterSpacing: "0.055em",
    lineHeight: 1.3,
  },

  salesFiltersLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.brand.primary,
    textTransform: "uppercase",
    letterSpacing: "0.055em",
    lineHeight: 1.3,
  },

  salesFiltersSelect: {
    minHeight: 56,
    borderRadius: "16px",
    bgcolor: colors.background.surface,
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: 600,

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.strong,
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.brand.primary,
      borderWidth: 1.5,
    },

    "& .MuiSelect-select": {
      py: 1.55,
      display: "flex",
      alignItems: "center",
    },
  },

  salesFiltersHelperText: {
    fontSize: 13,
    fontWeight: 400,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  salesFiltersDivider: {
    height: "1px",
    width: "100%",
    bgcolor: colors.border.default,
    my: { xs: 2.2, sm: 2.5 },
  },

  salesFiltersDateGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 1.4,
  },

  salesFiltersDateField: {
    display: "grid",
    gap: 0.65,
  },

  salesFiltersDateLabel: {
    fontSize: 11.5,
    fontWeight: 650,
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "0.045em",
    lineHeight: 1.3,
  },

  salesFiltersDateInput: {
    "& .MuiOutlinedInput-root": {
      minHeight: 56,
      borderRadius: "16px",
      bgcolor: colors.background.surface,
      color: colors.text.primary,
      fontSize: 15,
      fontWeight: 600,

      "& fieldset": {
        borderColor: colors.border.default,
      },

      "&:hover fieldset": {
        borderColor: colors.border.strong,
      },

      "&.Mui-focused fieldset": {
        borderColor: colors.brand.primary,
        borderWidth: 1.5,
      },
    },

    "& .MuiInputBase-input": {
      py: 1.45,
    },
  },

  salesFiltersActions: {
    px: { xs: 2.25, sm: 3 },
    py: { xs: 1.8, sm: 2 },
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.25,
    borderTop: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.soft,

    "@media (max-width: 599px)": {
      alignItems: "stretch",
      flexDirection: "column",
    },
  },

  salesFiltersPrimaryActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 1,

    "@media (max-width: 599px)": {
      width: "100%",

      "& > button": {
        flex: 1,
      },
    },
  },

  salesFiltersClearButton: {
    minHeight: 46,
    borderRadius: "14px",
    px: 1.8,
    color: colors.text.secondary,
    fontWeight: 700,
    textTransform: "none",
    border: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.surface,

    "&:hover": {
      color: colors.text.primary,
      bgcolor: subtleGreen,
      borderColor: colors.border.strong,
    },

    "&.Mui-disabled": {
      color: colors.text.secondary,
      opacity: 0.45,
      bgcolor: colors.background.surface,
      borderColor: colors.border.default,
    },
  },

  salesFiltersCancelButton: {
    minHeight: 46,
    borderRadius: "14px",
    px: 2,
    color: colors.text.secondary,
    fontWeight: 700,
    textTransform: "none",

    "&:hover": {
      color: colors.text.primary,
      bgcolor: colors.background.surface,
    },
  },

  salesFiltersApplyButton: {
    minHeight: 46,
    borderRadius: "14px",
    px: 2.3,
    bgcolor: colors.brand.primary,
    color: colors.text.inverse,
    fontWeight: 700,
    textTransform: "none",
    boxShadow: "0 12px 26px rgba(47, 111, 70, 0.20)",

    "&:hover": {
      bgcolor: colors.brand.primaryDark,
      boxShadow: "0 14px 30px rgba(47, 111, 70, 0.26)",
    },
  },

  errorBox: {
    mb: 2,
    p: 1.5,
    borderRadius: "16px",
    border: `1px solid ${colors.state.error}`,
    bgcolor: softError,
    color: colors.state.error,
    display: "flex",
    justifyContent: "space-between",
    gap: 2,
    alignItems: "center",
  },
};