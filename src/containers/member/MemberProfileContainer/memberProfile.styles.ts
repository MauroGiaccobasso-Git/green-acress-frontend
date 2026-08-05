import { alpha } from "@mui/material/styles";

import { colors } from "@/theme/colors";

/*
Estilos del perfil del Portal Socio.

Criterios aplicados:

- referencia visual Premium aprobada;
- continuidad visual con los módulos Gold;
- jerarquía tipográfica alineada con Dashboard;
- metadatos alineados con el detalle administrativo de Socios;
- mobile first y responsive real;
- información personal y límite legal claramente separados;
- estados de carga, error y actualización estable;
- uso de tokens globales siempre que corresponde.
*/

const panelShadow =
  "0 18px 44px rgba(15, 39, 27, 0.052)";

const profileShadow =
  "0 16px 38px rgba(15, 39, 27, 0.055)";

const neutralStrong = alpha(
  colors.text.primary,
  0.88,
);

const neutralSecondary = alpha(
  colors.text.primary,
  0.64,
);

const neutralLabel = alpha(
  colors.text.primary,
  0.68,
);

const neutralBorder = alpha(
  colors.text.primary,
  0.095,
);

const subtleDivider = alpha(
  colors.text.primary,
  0.085,
);

const neutralSurface = "#F8FAF8";

const activeSurface = alpha(
  colors.state.success,
  0.09,
);

const activeBorder = alpha(
  colors.state.success,
  0.16,
);

const reservedForeground =
  colors.state.warning;

const withdrawnForeground = alpha(
  colors.text.primary,
  0.62,
);

const availableSurface = "#EDF7EF";

const availableForeground =
  colors.state.success;

export const memberProfileStyles = {
  /* =========================================================
     ESTRUCTURA GENERAL
  ========================================================= */

  root: {
    width: "100%",
    minWidth: 0,
  },

  pageStack: {
    width: "100%",
    display: "grid",
    gap: {
      xs: 2,
      md: 2.5,
    },
  },

  updatedAtChip: {
    height: 34,
    maxWidth: 260,
    flexShrink: 0,
    borderRadius: "10px",
    color: colors.text.secondary,
    backgroundColor: "#F8FAF8",
    border: `1px solid ${colors.border.default}`,
    boxShadow:
      "0 4px 14px rgba(15, 39, 27, 0.025)",

    "& .MuiChip-icon": {
      ml: 1.05,
      color: colors.text.secondary,
      fontSize: 17,
    },

    "& .MuiChip-label": {
      px: 1.25,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "-0.005em",
    },
  },

  nonBlockingAlert: {
    borderRadius: "14px",
    border: `1px solid ${alpha(
      colors.state.warning,
      0.2,
    )}`,
    backgroundColor: alpha(
      colors.state.warning,
      0.075,
    ),
    color: colors.text.primary,

    "& .MuiAlert-icon": {
      color: colors.state.warning,
    },

    "& .MuiAlert-message": {
      fontSize: 13,
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },

  /* =========================================================
     CABECERA DEL PERFIL
  ========================================================= */

  profileCard: {
    minWidth: 0,
    p: {
      xs: 2.25,
      sm: 2.75,
      md: 3,
    },
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    alignItems: {
      xs: "flex-start",
      sm: "center",
    },
    justifyContent: "space-between",
    gap: {
      xs: 2,
      sm: 2.5,
    },
    borderRadius: {
      xs: "18px",
      sm: "20px",
    },
    background: `linear-gradient(
      105deg,
      ${colors.background.surface} 0%,
      ${alpha(
        colors.background.soft,
        0.72,
      )} 100%
    )`,
    border: `1px solid ${colors.border.default}`,
    boxShadow: profileShadow,
  },

  profileIdentity: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: {
      xs: 1.75,
      sm: 2.25,
    },
  },

  profileAvatar: {
    width: {
      xs: 68,
      sm: 82,
    },
    height: {
      xs: 68,
      sm: 82,
    },
    flexShrink: 0,
    color: colors.brand.primaryDark,
    backgroundColor:
      colors.brand.primaryLight,
    border: `1px solid ${alpha(
      colors.brand.primary,
      0.14,
    )}`,
    boxShadow:
      "0 10px 24px rgba(47, 111, 70, 0.09)",
    fontSize: {
      xs: 24,
      sm: 29,
    },
    fontWeight: 800,
    letterSpacing: "-0.04em",
  },

  profileCopy: {
    minWidth: 0,
  },

  profileName: {
    color: colors.text.primary,
    fontSize: {
      xs: 22,
      sm: 26,
    },
    fontWeight: 800,
    letterSpacing: "-0.035em",
    lineHeight: 1.15,
  },

  profileEmailRow: {
    minWidth: 0,
    mt: 0.65,
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    color: neutralSecondary,

    "& svg": {
      flexShrink: 0,
      fontSize: 17,
      color: colors.text.muted,
    },
  },

  profileEmail: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: neutralSecondary,
    fontSize: {
      xs: 12.5,
      sm: 13.25,
    },
    fontWeight: 400,
    lineHeight: 1.45,
  },

  profileStatusRow: {
    mt: 1.1,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 0.75,
  },

  activeStatusChip: {
    height: 29,
    borderRadius: "9px",
    color: colors.state.success,
    backgroundColor: activeSurface,
    border: `1px solid ${activeBorder}`,
    fontSize: 12,
    fontWeight: 700,

    "& .MuiChip-label": {
      px: 1.1,
    },

    "& .MuiChip-icon": {
      ml: 0.9,
      mr: -0.3,
      color: colors.state.success,
      fontSize: 10,
    },
  },

  inactiveStatusChip: {
    height: 29,
    borderRadius: "9px",
    color: colors.text.secondary,
    backgroundColor: alpha(
      colors.text.secondary,
      0.08,
    ),
    border: `1px solid ${alpha(
      colors.text.secondary,
      0.14,
    )}`,
    fontSize: 12,
    fontWeight: 700,

    "& .MuiChip-label": {
      px: 1.1,
    },
  },

  profileTypeChip: {
    minHeight: 42,
    px: 1.55,
    borderRadius: "12px",
    color: colors.brand.primaryDark,
    backgroundColor:
      colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    fontSize: 13,
    fontWeight: 650,
    boxShadow:
      "0 5px 16px rgba(15, 39, 27, 0.025)",

    "& .MuiChip-icon": {
      ml: 1,
      color: colors.brand.primary,
      fontSize: 19,
    },

    "& .MuiChip-label": {
      px: 1.1,
    },
  },

  /* =========================================================
     GRILLA PRINCIPAL
  ========================================================= */

  contentGrid: {
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      lg: "minmax(320px, 0.78fr) minmax(0, 1.42fr)",
    },
    alignItems: "stretch",
    gap: {
      xs: 2,
      md: 2.5,
    },
  },

  sectionCard: {
    minWidth: 0,
    height: "100%",
    p: {
      xs: 2.25,
      sm: 2.75,
    },
    borderRadius: {
      xs: "18px",
      sm: "20px",
    },
    backgroundColor:
      colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  /* =========================================================
     CABECERAS INTERNAS
  ========================================================= */

  sectionHeader: {
    minWidth: 0,
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    mb: 2.25,
    pb: 1.5,
    borderBottom: `1px solid ${subtleDivider}`,
  },

  sectionHeaderCopy: {
    minWidth: 0,
    flex: 1,
  },

  sectionIcon: {
    width: 36,
    height: 36,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "10px",
    color: colors.brand.primaryDark,
    backgroundColor: alpha(
      colors.brand.primary,
      0.085,
    ),
    border: `1px solid ${alpha(
      colors.brand.primary,
      0.12,
    )}`,

    "& svg": {
      fontSize: 19,
    },
  },

  sectionTitle: {
    color: colors.text.primary,
    fontSize: {
      xs: 19,
      sm: 20.5,
    },
    fontWeight: 820,
    letterSpacing: "-0.035em",
    lineHeight: 1.15,
  },

  sectionSubtitle: {
    mt: 0.55,
    color: colors.text.secondary,
    fontSize: {
      xs: 12.25,
      sm: 12.75,
    },
    fontWeight: 400,
    lineHeight: 1.5,
  },

  /* =========================================================
     INFORMACIÓN PERSONAL
  ========================================================= */

  personalInformationList: {
    display: "grid",
  },

  personalInformationRow: {
    minWidth: 0,
    minHeight: 58,
    py: 1.3,
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "minmax(130px, 0.72fr) minmax(0, 1.28fr)",
    },
    alignItems: {
      xs: "flex-start",
      sm: "center",
    },
    gap: {
      xs: 0.55,
      sm: 1.25,
    },
    borderBottom: `1px solid ${subtleDivider}`,

    "&:last-of-type": {
      borderBottom: "none",
    },
  },

  personalInformationLabel: {
    minWidth: 0,
    color: neutralLabel,
    fontSize: {
      xs: 11.25,
      sm: 11.5,
    },
    fontWeight: 650,
    textTransform: "uppercase",
    letterSpacing: "0.035em",
    lineHeight: 1.25,
  },

  personalInformationValue: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: {
      xs: "flex-start",
      sm: "flex-end",
    },
    gap: 0.8,
    overflowWrap: "anywhere",
    textAlign: {
      xs: "left",
      sm: "right",
    },
    color: neutralStrong,
    fontSize: {
      xs: 13.25,
      sm: 13.75,
    },
    fontWeight: 500,
    lineHeight: 1.45,

    "& svg": {
      flexShrink: 0,
      color: alpha(
        colors.text.primary,
        0.56,
      ),
      fontSize: 17,
    },
  },

  /* =========================================================
     LÍMITE LEGAL
  ========================================================= */

  legalMetricsGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, minmax(0, 1fr))",
      md: "repeat(4, minmax(0, 1fr))",
    },
    gap: {
      xs: 1,
      sm: 1.25,
    },
  },

  legalMetricCard: {
    minWidth: 0,
    minHeight: {
      xs: 102,
      sm: 112,
    },
    px: {
      xs: 1.25,
      sm: 1.5,
    },
    py: {
      xs: 1.65,
      sm: 1.9,
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: "13px",
    backgroundColor: neutralSurface,
    border: `1px solid ${neutralBorder}`,
  },

  legalMetricLabel: {
    color: colors.text.secondary,
    fontSize: {
      xs: 11.5,
      sm: 12.25,
    },
    fontWeight: 550,
    lineHeight: 1.35,
  },

  legalMetricValue: (
    foreground: string,
  ) => ({
    mt: 0.65,
    color: foreground,
    fontSize: {
      xs: 25,
      sm: 28,
    },
    fontWeight: 850,
    letterSpacing: "-0.045em",
    lineHeight: 1,
  }),

  limitTotalValue: {
    color: colors.brand.primaryDark,
  },

  withdrawnValue: {
    color: withdrawnForeground,
  },

  reservedValue: {
    color: reservedForeground,
  },

  availableValue: {
    color: availableForeground,
  },

  usageSection: {
    mt: {
      xs: 2.25,
      sm: 2.75,
    },
  },

  usageHeader: {
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    alignItems: {
      xs: "flex-start",
      sm: "center",
    },
    justifyContent: "space-between",
    gap: 1,
  },

  usageCopy: {
    minWidth: 0,
  },

  usageTitle: {
    color: colors.text.primary,
    fontSize: 13.5,
    fontWeight: 750,
    lineHeight: 1.3,
  },

  usageDescription: {
    mt: 0.35,
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 1.45,
  },

  usagePercentageChip: {
    height: 28,
    flexShrink: 0,
    borderRadius: "9px",
    color: colors.state.success,
    backgroundColor: activeSurface,
    border: `1px solid ${activeBorder}`,
    fontSize: 11.5,
    fontWeight: 750,

    "& .MuiChip-label": {
      px: 1.05,
    },
  },

  progressWrapper: {
    mt: 2,
  },

  progressTrack: {
    width: "100%",
    height: 14,
    display: "flex",
    overflow: "hidden",
    borderRadius: "999px",
    backgroundColor: availableSurface,
    border: `1px solid ${alpha(
      colors.brand.primary,
      0.08,
    )}`,
  },

  progressSegment: (
    widthPercentage: number,
    backgroundColor: string,
  ) => ({
    width: `${Math.max(
      0,
      Math.min(widthPercentage, 100),
    )}%`,
    minWidth:
      widthPercentage > 0 ? 4 : 0,
    height: "100%",
    flexShrink: 0,
    backgroundColor,
    transition: "width 220ms ease",
  }),

  progressAvailableSegment: {
    height: "100%",
    flex: 1,
    backgroundColor: alpha(
      colors.brand.primary,
      0.13,
    ),
  },

  progressScale: {
    mt: 0.75,
    display: "flex",
    justifyContent: "space-between",
    gap: 1,
  },

  progressScaleText: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: 550,
  },

  progressLegend: {
    mt: 1.5,
    display: "flex",
    flexWrap: "wrap",
    gap: {
      xs: 0.75,
      sm: 1,
    },
  },

  progressLegendItem: {
    minHeight: 32,
    px: 1.1,
    display: "flex",
    alignItems: "center",
    gap: 0.7,
    borderRadius: "10px",
    color: colors.text.secondary,
    backgroundColor:
      colors.background.surface,
    border: `1px solid ${neutralBorder}`,
    fontSize: 11.5,
    fontWeight: 550,
  },

  withdrawnLegendDot: {
    width: 9,
    height: 9,
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor:
      colors.brand.primary,
  },

  reservedLegendDot: {
    width: 9,
    height: 9,
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor:
      reservedForeground,
  },

  availableLegendDot: {
    width: 9,
    height: 9,
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: alpha(
      colors.brand.primary,
      0.28,
    ),
  },

  /* =========================================================
     ACCESOS RÁPIDOS
  ========================================================= */

  quickAccessCard: {
    minWidth: 0,
    p: {
      xs: 2.25,
      sm: 2.75,
    },
    borderRadius: {
      xs: "18px",
      sm: "20px",
    },
    backgroundColor:
      colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  quickAccessGrid: {
    mt: 2,
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(3, minmax(0, 1fr))",
    },
    gap: {
      xs: 1,
      md: 1.25,
    },
  },

  quickAccessItem: {
    minWidth: 0,
    minHeight: {
      xs: 82,
      sm: 92,
    },
    p: {
      xs: 1.45,
      sm: 1.65,
    },
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    borderRadius: "13px",
    color: colors.text.primary,
    backgroundColor:
      colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    textDecoration: "none",
    cursor: "pointer",
    transition:
      "transform 160ms ease, border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",

    "&:hover": {
      transform: "translateY(-1px)",
      borderColor: alpha(
        colors.brand.primary,
        0.32,
      ),
      backgroundColor: alpha(
        colors.background.soft,
        0.55,
      ),
      boxShadow:
        "0 10px 24px rgba(15, 39, 27, 0.055)",
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(
        colors.brand.primary,
        0.18,
      )}`,
      outlineOffset: 2,
    },
  },

  quickAccessIcon: {
    width: 46,
    height: 46,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "12px",
    color: colors.brand.primaryDark,
    backgroundColor:
      colors.brand.primaryLight,

    "& svg": {
      fontSize: 24,
    },
  },

  quickAccessCopy: {
    minWidth: 0,
    flex: 1,
  },

  quickAccessTitle: {
    color: colors.text.primary,
    fontSize: {
      xs: 13.5,
      sm: 14,
    },
    fontWeight: 750,
    lineHeight: 1.3,
  },

  quickAccessDescription: {
    mt: 0.35,
    color: colors.text.secondary,
    fontSize: {
      xs: 11.5,
      sm: 12,
    },
    lineHeight: 1.4,
  },

  quickAccessChevron: {
    flexShrink: 0,
    color: colors.brand.primaryDark,
    fontSize: 20,
  },

  /* =========================================================
     CARGA
  ========================================================= */

  skeletonProfileCard: {
    minHeight: {
      xs: 158,
      sm: 142,
    },
    p: {
      xs: 2.25,
      sm: 2.75,
    },
    borderRadius: {
      xs: "18px",
      sm: "20px",
    },
    backgroundColor:
      colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: profileShadow,
  },

  skeletonContentGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      lg: "minmax(320px, 0.78fr) minmax(0, 1.42fr)",
    },
    gap: {
      xs: 2,
      md: 2.5,
    },
  },

  skeletonCard: {
    minHeight: 390,
    p: {
      xs: 2.25,
      sm: 2.75,
    },
    borderRadius: {
      xs: "18px",
      sm: "20px",
    },
    backgroundColor:
      colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  /* =========================================================
     ERROR
  ========================================================= */

  errorCard: {
    minHeight: 320,
    px: {
      xs: 2.5,
      sm: 4,
    },
    py: {
      xs: 4,
      sm: 5,
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: "20px",
    backgroundColor:
      colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  errorIcon: {
    width: 58,
    height: 58,
    mb: 2,
    display: "grid",
    placeItems: "center",
    borderRadius: "16px",
    color: colors.state.error,
    backgroundColor: alpha(
      colors.state.error,
      0.08,
    ),
    border: `1px solid ${alpha(
      colors.state.error,
      0.14,
    )}`,

    "& svg": {
      fontSize: 31,
    },
  },

  errorTitle: {
    color: colors.text.primary,
    fontSize: {
      xs: 20,
      sm: 22,
    },
    fontWeight: 800,
    letterSpacing: "-0.035em",
    lineHeight: 1.15,
  },

  errorDescription: {
    maxWidth: 500,
    mt: 1,
    color: colors.text.secondary,
    fontSize: 13.5,
    fontWeight: 400,
    lineHeight: 1.6,
  },

  retryButton: {
    mt: 2.25,
    minHeight: 42,
    px: 2.5,
    borderRadius: "12px",
    color: colors.text.inverse,
    backgroundColor:
      colors.brand.primary,
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 750,
    boxShadow: "none",

    "&:hover": {
      backgroundColor:
        colors.brand.primaryDark,
      boxShadow:
        "0 8px 20px rgba(47, 111, 70, 0.18)",
    },
  },
} as const;

export const memberProfileLegalColors = {
  withdrawn: colors.brand.primary,
  reserved: reservedForeground,
  available: alpha(
    colors.brand.primary,
    0.28,
  ),
} as const;