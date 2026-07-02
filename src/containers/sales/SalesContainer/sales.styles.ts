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
const subtleBlue = "#F4FAFF";
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
    gap: 1.4,
    mb: 2.15,
  },

  panelHeaderCompact: {
    display: "flex",
    alignItems: "center",
    gap: 1.4,
  },

  panelIcon: {
    width: 42,
    height: 42,
    borderRadius: "13px",
    display: "grid",
    placeItems: "center",
    bgcolor: colors.background.soft,
    color: colors.brand.primary,
    border: `1px solid ${colors.border.default}`,
    flexShrink: 0,
  },

  panelTitle: {
    fontWeight: 800,
    color: colors.text.primary,
    lineHeight: 1.08,
    letterSpacing: "-0.03em",
  },

  panelSubtitle: {
    color: colors.text.secondary,
    mt: 0.25,
    fontSize: 14,
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
    fontWeight: 800,
    display: "grid",
    placeItems: "center",
    fontSize: 13,
    flexShrink: 0,
    boxShadow: "0 6px 12px rgba(47, 111, 70, 0.14)",
  },

  stepNumberBlue: {
    width: 27,
    height: 27,
    borderRadius: "8px",
    bgcolor: "#2F7FD0",
    color: colors.text.inverse,
    fontWeight: 800,
    display: "grid",
    placeItems: "center",
    fontSize: 13,
    flexShrink: 0,
    boxShadow: "0 4px 10px rgba(47, 127, 208, 0.10)",
  },

  stepNumberOrange: {
    width: 27,
    height: 27,
    borderRadius: "8px",
    bgcolor: colors.state.warning,
    color: colors.text.inverse,
    fontWeight: 800,
    display: "grid",
    placeItems: "center",
    fontSize: 13,
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
    fontWeight: 800,
    color: colors.text.primary,
    letterSpacing: "-0.01em",
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
    fontWeight: 700,
    color: colors.text.primary,
    fontSize: 12,
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
      fontWeight: 700,
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
    fontWeight: 800,
    color: colors.text.primary,
    lineHeight: 1.15,
    fontSize: 14,
  },

  optionSecondary: {
    fontSize: 12,
    color: colors.text.secondary,
    mt: 0.15,
  },

  activeChip: {
    bgcolor: colors.brand.primaryLight,
    color: colors.brand.primaryDark,
    fontWeight: 800,
    height: 22,
    fontSize: 10,
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
    fontSize: { xs: 21, md: 23 },
    fontWeight: 900,
    color: colors.text.primary,
    letterSpacing: "-0.04em",
    lineHeight: 1,
  },

  limitText: {
    fontWeight: 700,
    color: colors.text.secondary,
    fontSize: 14,
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
    fontSize: 12,
    fontWeight: 800,
    color: colors.text.secondary,
  },

  mutedText: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 1.25,
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
    fontWeight: 850,
    color: colors.state.success,
    fontSize: 17,
    lineHeight: 1.1,
  },

  addButton: {
    minHeight: 48,
    borderRadius: "12px",
    px: 1.8,
    bgcolor: colors.brand.primary,
    fontWeight: 800,
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
    px: 1.45,
    py: 0.55,
    bgcolor: colors.background.soft,

    "& .MuiTypography-root": {
      fontSize: 12,
      fontWeight: 800,
      color: colors.text.secondary,
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
    py: 0.75,
    borderTop: `1px solid ${colors.border.default}`,

    "& .MuiTypography-root": {
      fontSize: 13,
      color: colors.text.secondary,
    },
  },

  tableProductCell: {
    display: "flex",
    alignItems: "center",
    gap: 0.9,
  },

  productName: {
    fontWeight: 800,
    color: `${colors.text.primary} !important`,
  },

  subtotalText: {
    fontWeight: 900,
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
    fontSize: 15,
    color: colors.text.secondary,
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
    fontSize: 26,
    fontWeight: 900,
    color: colors.state.success,
    lineHeight: 1,
  },

  summaryMetricContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  summaryMetricLabel: {
    fontSize: 13,
    fontWeight: 800,
    color: colors.text.secondary,
    mb: 0.25,
  },

  summaryMetricValueOrange: {
    fontSize: 24,
    fontWeight: 900,
    color: colors.state.warning,
    lineHeight: 1,
  },

  summaryMetricValueGreen: {
    fontSize: 24,
    fontWeight: 900,
    color: colors.state.success,
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
    fontSize: 12,
    fontWeight: 800,
    color: colors.state.success,
  },

  observationsHeader: {
    display: "block",
    mb: 0.65,
    fontWeight: 800,
    fontSize: 14,
    color: colors.text.primary,
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
    fontSize: 17,
    fontWeight: 900,
    color: colors.state.warning,
    lineHeight: 1,
  },

  totalBox: {
    textAlign: { xs: "left", sm: "right" },
  },

  totalAmount: {
    fontSize: { xs: 28, md: 32 },
    fontWeight: 950,
    color: colors.brand.primaryDark,
    letterSpacing: "-0.045em",
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
    fontWeight: 800,
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
    fontWeight: 900,
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
    minHeight: 44,
    px: 2.15,
    textTransform: "none",
    fontWeight: 800,
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

    px: 2.2,
    py: 1.05,

    borderBottom: `1px solid ${colors.border.default}`,

    "& .MuiTypography-root": {
      minWidth: 0,
      fontSize: 11.5,
      fontWeight: 750,
      color: colors.text.secondary,
      textTransform: "uppercase",
      letterSpacing: "0.045em",
    },

    /*
    Alineación explícita por columna para que el encabezado
    coincida visualmente con el contenido de cada venta.
    */
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
    py: 1.7,

    borderBottom: `1px solid ${colors.border.default}`,
    transition: "background-color 160ms ease",

    "& > *": {
      minWidth: 0,
    },

    /*
    Las columnas numéricas y de estado se centran para evitar
    la sensación de tabla desfasada. La columna Acciones queda
    alineada al inicio y con ancho suficiente para ojo + acción.
    */
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
    fontWeight: 900,
    color: colors.text.primary,
  },

  saleDate: {
    display: "flex",
    alignItems: "flex-start",
    gap: 0.5,
    color: colors.text.secondary,
    lineHeight: 1.25,
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
    fontWeight: 800,
    color: colors.text.primary,
  },

  saleGrams: {
    fontSize: 16,
    fontWeight: 850,
    color: colors.text.primary,
    lineHeight: 1.1,
  },

  saleQuantity: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.text.primary,
  },

  saleTotal: {
    fontSize: 15,
    fontWeight: 850,
    color: colors.text.primary,
    letterSpacing: "-0.01em",
  },

  registeredChip: {
    height: 26,
    maxWidth: 118,
    justifySelf: "start",
    bgcolor: colors.brand.primaryLight,
    color: colors.brand.primaryDark,
    fontWeight: 900,

    "& .MuiChip-label": {
      px: 1.4,
      fontSize: 12,
    },
  },

  cancelledChip: {
    height: 24,
    minWidth: 92,
    justifySelf: "start",
    bgcolor: softError,
    color: colors.state.error,
    fontWeight: 900,
    borderRadius: "999px",

    "& .MuiChip-label": {
      px: 1.15,
      fontSize: 11.5,
      letterSpacing: "0.01em",
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
    fontWeight: 700,
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
    fontWeight: 900,
    color: colors.text.primary,
    mb: 0.5,
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
    fontSize: 11,
    fontWeight: 850,
    color: colors.brand.primary,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    mb: 0.35,
  },

  saleDetailTitle: {
    fontSize: { xs: 22, md: 25 },
    fontWeight: 850,
    color: colors.text.primary,
    letterSpacing: "-0.025em",
    lineHeight: 1.15,
  },

  saleDetailSubtitle: {
    mt: 0.45,
    fontSize: { xs: 13, md: 14 },
    fontWeight: 500,
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
    fontSize: 11.5,
    fontWeight: 800,
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "0.045em",
    mb: 0.45,
  },

  saleDetailValue: {
    fontSize: 14.5,
    fontWeight: 800,
    color: colors.text.primary,
    lineHeight: 1.3,
    wordBreak: "break-word",
  },

  saleDetailValueGreen: {
    fontSize: 14.5,
    fontWeight: 850,
    color: colors.brand.primary,
    lineHeight: 1.3,
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
    fontSize: 15.5,
    fontWeight: 850,
    color: colors.text.primary,
    letterSpacing: "-0.015em",
  },

  saleDetailSectionHint: {
    fontSize: 12.5,
    fontWeight: 550,
    color: colors.text.secondary,
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
    px: { xs: 1.35, md: 1.6 },
    py: 0.95,
    bgcolor: subtleGreen,
    borderBottom: `1px solid ${colors.border.default}`,
    "& .MuiTypography-root": {
      fontSize: 11.5,
      fontWeight: 800,
      color: colors.text.secondary,
      textTransform: "uppercase",
      letterSpacing: "0.035em",
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
    fontSize: 14,
    fontWeight: 850,
    color: colors.text.primary,
    lineHeight: 1.25,
  },

  saleDetailTableText: {
    fontSize: 13.2,
    fontWeight: 650,
    color: colors.text.secondary,
  },

  saleDetailTableTextStrong: {
    fontSize: 13.2,
    fontWeight: 800,
    color: colors.text.primary,
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
    fontSize: 13.2,
    fontWeight: 550,
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
    fontSize: { xs: 20, md: 22 },
    fontWeight: 850,
    color: colors.brand.primary,
    letterSpacing: "-0.025em",
    lineHeight: 1.1,
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
    fontWeight: 800,
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
    borderRadius: "28px",
    bgcolor: colors.background.surface,
    boxShadow: "0 28px 90px rgba(16, 41, 28, 0.18)",
    overflow: "hidden",
  },

  salesFiltersHeader: {
    px: { xs: 2.25, md: 2.8 },
    pt: { xs: 2.25, md: 2.6 },
    pb: 1.55,
    borderBottom: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.surface,
  },

  salesFiltersTitle: {
    fontSize: { xs: 21, md: 24 },
    fontWeight: 850,
    color: colors.text.primary,
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
  },

  salesFiltersSubtitle: {
    mt: 0.45,
    fontSize: 13.5,
    fontWeight: 500,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },

  salesFiltersContent: {
    px: { xs: 2.25, md: 2.8 },
    pt: { xs: 2.35, md: 2.65 },
    pb: { xs: 2.1, md: 2.4 },
    bgcolor: colors.background.surface,
  },

  salesFiltersSection: {
    display: "grid",
    gap: 1,

    /*
    Evita que el primer label del modal quede visualmente
    pegado al divisor del encabezado.
    */
    "&:first-of-type": {
      mt: 0.35,
    },
  },

  salesFiltersLabel: {
    fontSize: 12,
    fontWeight: 850,
    color: colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "0.045em",
  },

  salesFiltersSelect: {
    borderRadius: "16px",
    bgcolor: colors.background.soft,
    color: colors.text.primary,
    fontWeight: 650,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.default,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.brand.primary,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.brand.primary,
      borderWidth: 1,
    },
    "& .MuiSelect-select": {
      py: 1.2,
    },
  },

  salesFiltersDivider: {
    height: "1px",
    width: "100%",
    bgcolor: colors.border.default,
    my: 2,
  },

  salesFiltersDateGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 1.25,
  },

  salesFiltersDateInput: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      bgcolor: colors.background.soft,
      color: colors.text.primary,
      fontWeight: 650,
      "& fieldset": {
        borderColor: colors.border.default,
      },
      "&:hover fieldset": {
        borderColor: colors.brand.primary,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.brand.primary,
        borderWidth: 1,
      },
    },
    "& .MuiInputLabel-root": {
      color: colors.text.secondary,
      fontWeight: 700,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.brand.primary,
    },
  },

  salesFiltersActions: {
    px: { xs: 2.25, md: 2.8 },
    py: 1.8,
    gap: 1,
    borderTop: `1px solid ${colors.border.default}`,
    bgcolor: colors.background.soft,
  },

  salesFiltersClearButton: {
    borderRadius: "16px",
    px: 2.2,
    py: 1,
    color: colors.text.primary,
    fontWeight: 800,
    textTransform: "none",
    bgcolor: colors.background.surface,
    boxShadow: "0 10px 24px rgba(16, 41, 28, 0.045)",
    "&:hover": {
      bgcolor: subtleGreen,
    },
  },

  salesFiltersApplyButton: {
    borderRadius: "16px",
    px: 2.4,
    py: 1,
    bgcolor: colors.brand.primary,
    color: colors.text.inverse,
    fontWeight: 850,
    textTransform: "none",
    boxShadow: "0 14px 30px rgba(47, 111, 70, 0.22)",
    "&:hover": {
      bgcolor: colors.brand.primaryDark,
      boxShadow: "0 16px 34px rgba(47, 111, 70, 0.28)",
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
