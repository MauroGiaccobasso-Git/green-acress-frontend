import { alpha } from "@mui/material/styles";

import { colors } from "@/theme/colors";

/*
Estilos del Dashboard administrativo.

Criterios aplicados:
- continuidad visual con los módulos Gold existentes;
- composición basada en la referencia Premium aprobada;
- mobile first y sin desplazamiento horizontal global;
- jerarquía clara entre KPI, alertas, IA y demanda;
- estados de carga, error y vacío con layout estable;
- uso de tokens globales y colores semánticos controlados;
- componentes informativos sin aparentar acciones transaccionales.
*/

const panelShadow = "0 18px 44px rgba(15, 39, 27, 0.052)";

const summaryShadow = "0 14px 32px rgba(15, 39, 27, 0.055)";

const greenSurface = "#ECF8EE";
const greenForeground = "#16823A";

const tealSurface = "#E7F7F4";
const tealForeground = "#0B8E83";

const limeSurface = "#F0F7E8";
const limeForeground = "#5B9E1E";

const violetSurface = "#F1ECFF";
const violetSoftSurface = "#F8F5FF";
const violetBorder = "#E4DAFC";
const violetForeground = "#6941C6";
const violetDark = "#5630B8";

const warningSurface = "#FFF4E8";
const warningBorder = "#F8D8B2";
const warningForeground = "#E8790A";

const criticalSurface = "#FDECEC";
const criticalBorder = "#F7C7C7";
const criticalForeground = "#C62828";

const neutralSurface = "#F7F9F7";

const neutralBorder = alpha(colors.text.primary, 0.095);

const subtleDivider = alpha(colors.text.primary, 0.09);

const topProductsColumns =
  "minmax(238px, 1.55fr) " +
  "minmax(125px, 0.78fr) " +
  "minmax(116px, 0.72fr) " +
  "minmax(126px, 0.78fr) " +
  "minmax(150px, 0.9fr)";

export const dashboardStyles = {
  /* =========================================================
     ESTRUCTURA GENERAL
  ========================================================= */

  root: {
    width: "100%",
    minWidth: 0,
  },

  pageStack: {
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
    boxShadow: "0 4px 14px rgba(15, 39, 27, 0.025)",

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

  mainGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      lg: "minmax(0, 1.04fr) minmax(420px, 0.96fr)",
    },
    alignItems: "start",
    gap: {
      xs: 2,
      md: 2.5,
    },
  },

  nonBlockingAlert: {
    borderRadius: "14px",
    border: `1px solid ${warningBorder}`,
    backgroundColor: warningSurface,
    color: colors.text.primary,

    "& .MuiAlert-icon": {
      color: warningForeground,
    },

    "& .MuiAlert-message": {
      fontSize: 13,
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },

  initialErrorCard: {
    minHeight: 340,
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
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  initialErrorIcon: {
    width: 62,
    height: 62,
    mb: 2,
    display: "grid",
    placeItems: "center",
    borderRadius: "18px",
    color: criticalForeground,
    backgroundColor: criticalSurface,
    border: `1px solid ${criticalBorder}`,

    "& svg": {
      fontSize: 34,
    },
  },

  initialErrorTitle: {
    fontSize: {
      xs: 20,
      sm: 22,
    },
    fontWeight: 800,
    letterSpacing: "-0.035em",
    lineHeight: 1.15,
    color: colors.text.primary,
  },

  initialErrorText: {
    maxWidth: 520,
    mt: 1,
    fontSize: 13.5,
    fontWeight: 400,
    lineHeight: 1.6,
    color: colors.text.secondary,
  },

  retryButton: {
    mt: 2.25,
    minHeight: 42,
    px: 2.5,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 750,
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    boxShadow: "none",

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 8px 20px rgba(47, 111, 70, 0.18)",
    },
  },

  /* =========================================================
     CABECERAS DE TARJETAS
  ========================================================= */

  cardHeader: {
    display: "flex",
    alignItems: {
      xs: "flex-start",
      sm: "center",
    },
    justifyContent: "space-between",
    gap: 1.5,
  },

  cardTitle: {
    fontSize: {
      xs: 19,
      sm: 20.5,
    },
    fontWeight: 820,
    letterSpacing: "-0.035em",
    lineHeight: 1.15,
    color: colors.text.primary,
  },

  cardSubtitle: {
    mt: 0.55,
    fontSize: {
      xs: 12.25,
      sm: 12.75,
    },
    fontWeight: 400,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },

  /* =========================================================
     INDICADORES PRINCIPALES
  ========================================================= */

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(4, minmax(0, 1fr))",
    },
    gap: {
      xs: 1.5,
      md: 2,
      xl: 2.25,
    },
  },

  summaryCard: {
    minWidth: 0,
    minHeight: {
      xs: 124,
      sm: 138,
      xl: 144,
    },
    p: {
      xs: "21px",
      sm: "25px 24px",
      xl: "27px 26px",
    },
    display: "flex",
    alignItems: "center",
    gap: {
      xs: 2,
      sm: 2.5,
      xl: 2.75,
    },
    borderRadius: {
      xs: "17px",
      sm: "19px",
    },
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: summaryShadow,
    transition: "transform 180ms ease, box-shadow 180ms ease",

    "@media (hover: hover)": {
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 17px 38px rgba(15, 39, 27, 0.07)",
      },
    },
  },

  summarySkeletonCard: {
    minWidth: 0,
    minHeight: {
      xs: 124,
      sm: 138,
      xl: 144,
    },
    p: {
      xs: "21px",
      sm: "25px 24px",
      xl: "27px 26px",
    },
    display: "flex",
    alignItems: "center",
    gap: {
      xs: 2,
      sm: 2.5,
      xl: 2.75,
    },
    borderRadius: {
      xs: "17px",
      sm: "19px",
    },
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: summaryShadow,
  },

  summaryIcon: {
    width: {
      xs: 56,
      sm: 62,
      xl: 66,
    },
    height: {
      xs: 56,
      sm: 62,
      xl: 66,
    },
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: {
      xs: "16px",
      sm: "17px",
      xl: "18px",
    },

    "& svg": {
      fontSize: {
        xs: 29,
        sm: 32,
        xl: 34,
      },
    },
  },

  summaryIconSales: {
    color: greenForeground,
    backgroundColor: greenSurface,
  },

  summaryIconRevenue: {
    color: tealForeground,
    backgroundColor: tealSurface,
  },

  summaryIconGrams: {
    color: limeForeground,
    backgroundColor: limeSurface,
  },

  summaryIconMembers: {
    color: violetForeground,
    backgroundColor: violetSurface,
  },

  summaryContent: {
    minWidth: 0,
    flex: 1,
  },

  summaryLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: {
      xs: 13,
      sm: 13.5,
      xl: 14,
    },
    fontWeight: 680,
    letterSpacing: "-0.012em",
    lineHeight: 1.25,
    color: colors.text.primary,
  },

  summaryValue: {
    mt: {
      xs: 0.75,
      sm: 0.9,
    },
    fontSize: {
      xs: 29,
      sm: 32,
      xl: 34,
    },
    fontWeight: 760,
    letterSpacing: "-0.05em",
    lineHeight: 1,
    color: colors.text.primary,
  },

  summaryHint: {
    mt: {
      xs: 0.8,
      sm: 0.95,
    },
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: {
      xs: 12,
      sm: 12.4,
      xl: 12.75,
    },
    fontWeight: 430,
    lineHeight: 1.3,
    color: colors.text.secondary,
  },

  /* =========================================================
     ATENCIÓN REQUERIDA — DISEÑO PREMIUM
  ========================================================= */

  /*
  Mantiene una tarjeta amplia, limpia y compacta.

  Se eliminan cajas internas, mensajes redundantes y ruido
  visual para reproducir la referencia Premium aprobada.
  */
  attentionCard: {
    minWidth: 0,
    p: {
      xs: "22px 20px",
      sm: "27px 28px",
      xl: "30px 32px",
    },
    borderRadius: {
      xs: "18px",
      sm: "20px",
    },
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  /*
  Separa el título de los tres bloques sin añadir
  un subtítulo innecesario.
  */
  alertSections: {
    mt: {
      xs: 1.5,
      sm: 2,
      xl: 2.25,
    },
  },

  /*
  Cada situación conserva una altura suficiente para que
  icono, información y acción respiren correctamente.
  */
  alertSection: {
    py: {
      xs: 2,
      sm: 2.35,
      xl: 2.5,
    },
  },

  alertSectionHeader: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: {
      xs: 1.5,
      sm: 2,
      xl: 2.2,
    },
  },

  /*
  Iconos grandes con superficies suaves, iguales a la
  jerarquía utilizada en la referencia Premium.
  */
  alertIcon: {
    width: {
      xs: 56,
      sm: 62,
      xl: 66,
    },
    height: {
      xs: 56,
      sm: 62,
      xl: 66,
    },
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: {
      xs: "15px",
      sm: "17px",
    },
    border: "1px solid transparent",

    "& svg": {
      fontSize: {
        xs: 30,
        sm: 34,
        xl: 36,
      },
      strokeWidth: 1.5,
    },
  },

  alertIconWarning: {
    color: warningForeground,
    backgroundColor: warningSurface,
    borderColor: alpha(warningForeground, 0.12),
  },

  alertIconCritical: {
    color: criticalForeground,
    backgroundColor: criticalSurface,
    borderColor: alpha(criticalForeground, 0.12),
  },

  alertIconError: {
    color: criticalForeground,
    backgroundColor: "#FFF0EE",
    borderColor: "#F8CECA",
  },

  alertHeaderContent: {
    minWidth: 0,
    flex: 1,
  },

  alertTitle: {
    fontSize: {
      xs: 14.25,
      sm: 15.5,
      xl: 16,
    },
    fontWeight: 760,
    letterSpacing: "-0.022em",
    lineHeight: 1.28,
    color: colors.text.primary,
  },

  alertCount: {
    mt: 0.35,
    fontSize: {
      xs: 12.5,
      sm: 13.25,
      xl: 13.5,
    },
    fontWeight: 780,
    lineHeight: 1.3,
  },

  alertCountWarning: {
    color: warningForeground,
  },

  alertCountCritical: {
    color: criticalForeground,
  },

  alertCountError: {
    color: criticalForeground,
  },

  alertDescription: {
    mt: 0.45,
    fontSize: {
      xs: 12.25,
      sm: 13,
      xl: 13.25,
    },
    fontWeight: 420,
    lineHeight: 1.45,
    color: colors.text.secondary,
  },

  /*
  Acción reducida exclusivamente al chevron.

  Conserva un área táctil accesible sin mostrar etiquetas
  que no aparecen en la referencia.
  */
  alertSectionAction: {
    width: {
      xs: 36,
      sm: 40,
    },
    height: {
      xs: 36,
      sm: 40,
    },
    minWidth: {
      xs: 36,
      sm: 40,
    },
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "10px",
    color: colors.text.primary,
    textDecoration: "none",
    transition: "color 160ms ease, background-color 160ms ease",

    "&:hover": {
      color: colors.brand.primary,
      backgroundColor: colors.background.soft,
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.brand.primary, 0.18)}`,
      outlineOffset: 2,
    },

    "& svg": {
      fontSize: {
        xs: 25,
        sm: 28,
      },
    },
  },

  /*
  Divisor completo entre categorías, sin sangrías internas.
  */
  alertDivider: {
    m: 0,
    borderColor: subtleDivider,
  },

  /*
  Los detalles se muestran como líneas simples con bullets,
  dentro del mismo bloque textual de la categoría.
  */
  alertItemsList: {
    m: 0,
    mt: {
      xs: 0.65,
      sm: 0.75,
    },
    p: 0,
    display: "grid",
    gap: {
      xs: 0.4,
      sm: 0.5,
    },
    listStyle: "none",
  },

  alertItem: {
    position: "relative",
    minWidth: 0,
    pl: {
      xs: 2,
      sm: 2.2,
    },
    display: "block",
    fontSize: 0,
    lineHeight: 1.45,
    color: colors.text.secondary,

    "&::before": {
      content: '""',
      position: "absolute",
      top: {
        xs: "8px",
        sm: "9px",
      },
      left: 2,
      width: 5,
      height: 5,
      borderRadius: "50%",
      backgroundColor: criticalForeground,
      boxShadow: `0 0 0 3px ${alpha(criticalForeground, 0.07)}`,
    },
  },

  alertItemContent: {
    minWidth: 0,
    display: "block",
  },

  alertItemTitle: {
    display: "inline",
    fontSize: {
      xs: 11.75,
      sm: 12.5,
      xl: 12.75,
    },
    fontWeight: 650,
    lineHeight: 1.45,
    color: colors.text.secondary,
    overflowWrap: "anywhere",
  },

  alertItemMeta: {
    display: "inline",
    fontSize: {
      xs: 11.75,
      sm: 12.5,
      xl: 12.75,
    },
    fontWeight: 400,
    lineHeight: 1.45,
    color: colors.text.secondary,
    overflowWrap: "anywhere",
  },

  alertItemSecondaryMeta: {
    display: "block",
    mt: 0.2,
    fontSize: {
      xs: 10.75,
      sm: 11.25,
    },
    fontWeight: 400,
    lineHeight: 1.4,
    color: colors.text.muted,
  },

  alertSkeletonList: {
    mt: {
      xs: 1.5,
      sm: 2,
    },
  },

  alertSkeletonItem: {
    minHeight: {
      xs: 92,
      sm: 108,
    },
    py: {
      xs: 1.6,
      sm: 2,
    },
    display: "flex",
    alignItems: "center",
    gap: {
      xs: 1.5,
      sm: 2,
    },
  },

  /* =========================================================
     RECOMENDACIONES INTELIGENTES
  ========================================================= */

  recommendationsCard: {
    minWidth: 0,
    p: {
      xs: 2.25,
      sm: 2.75,
      lg: 3,
    },
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  recommendationsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
  },

  recommendationsTitleRow: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: {
      xs: 1.1,
      sm: 1.25,
    },
  },

  recommendationsTitleIcon: {
    width: {
      xs: 40,
      sm: 44,
    },
    height: {
      xs: 40,
      sm: 44,
    },
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: {
      xs: "11px",
      sm: "13px",
    },
    color: violetForeground,
    backgroundColor: violetSurface,
    border: `1px solid ${violetBorder}`,

    "& svg": {
      fontSize: {
        xs: 22,
        sm: 24,
      },
    },
  },

  recommendationsDescription: {
    mt: {
      xs: 1.35,
      sm: 1.5,
    },
    maxWidth: 760,
    fontSize: {
      xs: 12.75,
      sm: 13.5,
      xl: 13.75,
    },
    fontWeight: 400,
    lineHeight: 1.55,
    color: colors.text.secondary,
  },

  recommendationsButton: {
    width: {
      xs: "100%",
      sm: "auto",
    },
    minHeight: {
      xs: 42,
      sm: 44,
    },
    mt: {
      xs: 1.55,
      sm: 1.8,
    },
    px: {
      xs: 2,
      sm: 2.35,
    },
    borderRadius: "11px",
    textTransform: "none",
    fontSize: {
      xs: 12.75,
      sm: 13.25,
    },
    fontWeight: 760,
    color: colors.text.inverse,
    backgroundColor: violetForeground,
    boxShadow: "0 9px 22px rgba(105, 65, 198, 0.22)",
    transition:
      "transform 160ms ease, background-color 160ms ease, box-shadow 160ms ease",

    "&:hover": {
      transform: "translateY(-1px)",
      backgroundColor: violetDark,
      boxShadow: "0 12px 28px rgba(105, 65, 198, 0.27)",
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(violetForeground, 0.2)}`,
      outlineOffset: 2,
    },

    "&.Mui-disabled": {
      color: alpha(colors.text.inverse, 0.84),
      backgroundColor: alpha(violetForeground, 0.72),
      boxShadow: "none",
      transform: "none",
    },

    "& .MuiButton-startIcon": {
      mr: 0.8,
    },
  },

  recommendationsGeneratedAt: {
    mt: 0.85,
    fontSize: 10.9,
    fontWeight: 500,
    lineHeight: 1.4,
    color: colors.text.muted,
  },

  recommendationsAlert: {
    mt: 1.4,
    borderRadius: "12px",
    alignItems: "flex-start",

    "& .MuiAlert-message": {
      fontSize: 11.75,
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },

  recommendationsResults: {
    minWidth: 0,
    mt: {
      xs: 1.6,
      sm: 1.85,
    },
  },

  /*
  En mobile se utiliza el scroll natural de la página.

  Desde desktop se limita la altura del listado para que entre una y
  cinco recomendaciones no deformen toda la composición del Dashboard.
  */
  recommendationsList: {
    m: 0,
    p: 0,
    pr: {
      xs: 0,
      lg: 0.55,
    },
    display: "grid",
    gap: {
      xs: 1.2,
      sm: 1.4,
    },
    maxHeight: {
      xs: "none",
      lg: 620,
    },
    overflowY: {
      xs: "visible",
      lg: "auto",
    },
    overscrollBehavior: "contain",
    scrollbarWidth: "thin",
    scrollbarColor: `${alpha(violetForeground, 0.28)} transparent`,
    listStyle: "none",

    "&::-webkit-scrollbar": {
      width: 6,
    },

    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },

    "&::-webkit-scrollbar-thumb": {
      borderRadius: "999px",
      backgroundColor: alpha(violetForeground, 0.24),
    },

    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: alpha(violetForeground, 0.36),
    },
  },

  recommendationCard: {
    minWidth: 0,
    p: {
      xs: 1.8,
      sm: 2.2,
      xl: 2.35,
    },
    borderRadius: {
      xs: "16px",
      sm: "18px",
    },
    background:
      "linear-gradient(" +
      "135deg, " +
      "rgba(248, 245, 255, 0.98) 0%, " +
      "rgba(252, 250, 255, 0.99) 100%" +
      ")",
    border: `1px solid ${violetBorder}`,
    boxShadow: "0 12px 30px rgba(105, 65, 198, 0.06)",
  },

  recommendationHeader: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
  },

  recommendationProductIdentity: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: {
      xs: 1.35,
      sm: 1.6,
    },

    /*
    DashboardProductImage mantiene 48 px como base para TopProducts.
    En recomendaciones se amplía visualmente sin duplicar componente.
    */
    "& > img, & > [role='img']": {
      width: {
        xs: 60,
        sm: 68,
      },
      height: {
        xs: 60,
        sm: 68,
      },
      borderRadius: {
        xs: "14px",
        sm: "16px",
      },
    },
  },

  recommendationProductContent: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 0.7,
  },

  recommendationProductName: {
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: {
      xs: 15.5,
      sm: 17,
      xl: 17.5,
    },
    fontWeight: 790,
    letterSpacing: "-0.025em",
    lineHeight: 1.2,
    color: colors.text.primary,
  },

  recommendationPriorityChip: {
    height: {
      xs: 24,
      sm: 26,
    },
    maxWidth: "100%",
    borderRadius: "8px",
    fontSize: {
      xs: 10.25,
      sm: 10.75,
    },
    fontWeight: 760,
    border: "1px solid transparent",

    "& .MuiChip-label": {
      px: {
        xs: 0.9,
        sm: 1,
      },
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },

  recommendationPriorityHigh: {
    color: criticalForeground,
    backgroundColor: criticalSurface,
    borderColor: criticalBorder,
  },

  recommendationPriorityMedium: {
    color: warningForeground,
    backgroundColor: warningSurface,
    borderColor: warningBorder,
  },

  recommendationPriorityLow: {
    color: colors.state.success,
    backgroundColor: greenSurface,
    borderColor: alpha(colors.state.success, 0.18),
  },

  recommendationQuantityPanel: {
    mt: {
      xs: 1.75,
      sm: 2,
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,
  },

  recommendationQuantityLabel: {
    fontSize: {
      xs: 12.75,
      sm: 13.5,
    },
    fontWeight: 650,
    lineHeight: 1.35,
    color: colors.text.primary,
  },

  recommendationQuantityValue: {
    minWidth: 52,
    height: 30,
    px: 1.25,
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9px",
    border: `1px solid ${violetBorder}`,
    backgroundColor: violetSurface,
    color: violetForeground,
    fontSize: {
      xs: 14.5,
      sm: 15.5,
    },
    fontWeight: 800,
    letterSpacing: "-0.015em",
    lineHeight: 1,
    boxShadow: "0 3px 8px rgba(105, 65, 198, 0.07)",
  },

  recommendationDivider: {
    my: {
      xs: 1.45,
      sm: 1.65,
    },
    borderColor: alpha(violetForeground, 0.13),
  },

  recommendationJustificationLabel: {
    fontSize: {
      xs: 12.5,
      sm: 13.25,
    },
    fontWeight: 740,
    lineHeight: 1.35,
    color: colors.text.primary,
  },

  recommendationJustificationText: {
    mt: 0.5,
    fontSize: {
      xs: 12.25,
      sm: 13,
    },
    fontWeight: 400,
    lineHeight: 1.58,
    color: colors.text.secondary,
    overflowWrap: "anywhere",
  },

  recommendationsInitialState: {
    minHeight: {
      xs: 106,
      sm: 116,
    },
    p: {
      xs: 1.55,
      sm: 1.8,
    },
    display: "flex",
    alignItems: "center",
    gap: 1.35,
    borderRadius: "14px",
    backgroundColor: violetSoftSurface,
    border: `1px dashed ${violetBorder}`,
  },

  recommendationsInitialIcon: {
    width: {
      xs: 42,
      sm: 46,
    },
    height: {
      xs: 42,
      sm: 46,
    },
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "13px",
    color: violetForeground,
    backgroundColor: colors.background.surface,
    border: `1px solid ${violetBorder}`,

    "& svg": {
      fontSize: {
        xs: 23,
        sm: 25,
      },
    },
  },

  recommendationsInitialTitle: {
    fontSize: {
      xs: 13.25,
      sm: 13.75,
    },
    fontWeight: 740,
    lineHeight: 1.3,
    color: colors.text.primary,
  },

  recommendationsInitialText: {
    mt: 0.4,
    maxWidth: 580,
    fontSize: {
      xs: 11.75,
      sm: 12.25,
    },
    fontWeight: 400,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },

  recommendationsEmptyState: {
    minHeight: 150,
    p: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: "14px",
    backgroundColor: greenSurface,
    border: `1px solid ${alpha(colors.state.success, 0.18)}`,
  },

  recommendationsEmptyIcon: {
    width: 44,
    height: 44,
    display: "grid",
    placeItems: "center",
    borderRadius: "13px",
    color: colors.state.success,
    backgroundColor: colors.background.surface,
    border: `1px solid ${alpha(colors.state.success, 0.17)}`,

    "& svg": {
      fontSize: 25,
    },
  },

  recommendationsEmptyTitle: {
    mt: 1,
    fontSize: 13.5,
    fontWeight: 750,
    lineHeight: 1.3,
    color: colors.text.primary,
  },

  recommendationsEmptyText: {
    maxWidth: 430,
    mt: 0.45,
    fontSize: 11.75,
    fontWeight: 400,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },

  recommendationsLoadingList: {
    display: "grid",
    gap: 1.25,
  },

  recommendationSkeletonCard: {
    p: {
      xs: 1.8,
      sm: 2.2,
    },
    display: "grid",
    gap: 0.9,
    borderRadius: {
      xs: "16px",
      sm: "18px",
    },
    backgroundColor: violetSoftSurface,
    border: `1px solid ${violetBorder}`,
  },

  /* =========================================================
     PRODUCTOS CON MAYOR DEMANDA
  ========================================================= */

  topProductsCard: {
    minWidth: 0,
    p: {
      xs: 2,
      sm: 2.5,
      lg: 2.75,
    },
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  topProductsHeader: {
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
    gap: 1.2,
    mb: 1.65,
  },

  topProductsPeriodChip: {
    height: 30,
    flexShrink: 0,
    borderRadius: "9px",
    fontSize: 11,
    fontWeight: 650,
    color: colors.brand.primary,
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,

    "& .MuiChip-icon": {
      ml: 0.8,
      color: colors.brand.primary,
      fontSize: 16,
    },

    "& .MuiChip-label": {
      px: 1,
    },
  },

  topProductsTable: {
    minWidth: 0,
    overflow: "hidden",
    borderRadius: "13px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 7px 22px rgba(15, 39, 27, 0.024)",
  },

  topProductsTableHeader: {
    display: {
      xs: "none",
      lg: "grid",
    },
    gridTemplateColumns: topProductsColumns,
    alignItems: "center",
    columnGap: 2,
    minHeight: 42,
    px: 1.75,
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: alpha(colors.background.soft, 0.5),

    "& > *": {
      minWidth: 0,
      fontSize: {
        lg: 11.25,
        xl: 11.5,
      },
      fontWeight: 720,
      letterSpacing: "-0.005em",
      lineHeight: 1.2,
      color: colors.text.primary,
      whiteSpace: "nowrap",
    },
  },

  topProductsRow: {
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, minmax(0, 1fr))",
      sm: "repeat(3, minmax(0, 1fr))",
      lg: topProductsColumns,
    },
    alignItems: "center",
    columnGap: {
      xs: 0.85,
      lg: 2,
    },
    rowGap: {
      xs: 0.85,
      lg: 0,
    },
    minHeight: {
      lg: 70,
    },
    px: {
      xs: 1.15,
      sm: 1.4,
      lg: 1.75,
    },
    py: {
      xs: 1.35,
      lg: 1.1,
    },
    borderBottom: `1px solid ${colors.border.default}`,
    backgroundColor: colors.background.surface,

    "&:last-of-type": {
      borderBottom: "none",
    },

    "& > [role='cell']:nth-of-type(4)": {
      gridColumn: {
        xs: "1 / -1",
        sm: "auto",
        lg: "auto",
      },
    },
  },

  topProductsProductCell: {
    minWidth: 0,
    gridColumn: {
      xs: "1 / -1",
      lg: "auto",
    },
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    pb: {
      xs: 0.45,
      lg: 0,
    },
  },

  topProductsProductIcon: {
    width: {
      xs: 44,
      lg: 46,
    },
    height: {
      xs: 44,
      lg: 46,
    },
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "11px",
    color: colors.brand.primary,
    backgroundColor: greenSurface,
    border: `1px solid ${colors.border.default}`,

    "& svg": {
      fontSize: 23,
    },
  },

  topProductsProductIdentity: {
    minWidth: 0,
  },

  topProductsProductName: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: {
      xs: 12.75,
      lg: 13.2,
    },
    fontWeight: 720,
    letterSpacing: "-0.015em",
    lineHeight: 1.3,
    color: colors.text.primary,
  },

  topProductsProductMeta: {
    mt: 0.35,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 10.75,
    fontWeight: 400,
    lineHeight: 1.35,
    color: colors.text.secondary,
  },

  topProductsMetricCell: {
    minWidth: 0,
    minHeight: {
      xs: 58,
      lg: "auto",
    },
    px: {
      xs: 1,
      lg: 0,
    },
    py: {
      xs: 0.85,
      lg: 0,
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: {
      xs: "10px",
      lg: 0,
    },
    backgroundColor: {
      xs: neutralSurface,
      lg: "transparent",
    },
    border: {
      xs: `1px solid ${neutralBorder}`,
      lg: "none",
    },
  },

  topProductsMobileLabel: {
    display: {
      xs: "block",
      lg: "none",
    },
    mb: 0.35,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: 9.5,
    fontWeight: 750,
    letterSpacing: "0.045em",
    lineHeight: 1.2,
    textTransform: "uppercase",
    color: colors.text.muted,
  },

  topProductsMetricValue: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: {
      xs: 12.25,
      lg: 12.5,
    },
    fontWeight: 560,
    lineHeight: 1.25,
    color: colors.text.primary,
  },

  /*
  La demanda total se distingue solamente por peso tipográfico.

  No aumenta de tamaño para mantener una lectura uniforme
  entre todas las métricas de la fila.
  */
  topProductsDemandValue: {
    fontWeight: 700,
    color: colors.text.primary,
  },

  topProductsAvailabilityCell: {
    minWidth: 0,
    gridColumn: {
      xs: "1 / -1",
      lg: "auto",
    },
    minHeight: {
      xs: 58,
      lg: "auto",
    },
    px: {
      xs: 1,
      lg: 0,
    },
    py: {
      xs: 0.85,
      lg: 0,
    },
    display: "flex",
    alignItems: {
      xs: "center",
      lg: "flex-start",
    },
    justifyContent: {
      xs: "space-between",
      lg: "center",
    },
    flexDirection: {
      xs: "row",
      lg: "column",
    },
    gap: {
      xs: 1,
      lg: 0.35,
    },
    borderRadius: {
      xs: "10px",
      lg: 0,
    },
    backgroundColor: {
      xs: neutralSurface,
      lg: "transparent",
    },
    border: {
      xs: `1px solid ${neutralBorder}`,
      lg: "none",
    },
  },

  topProductsAvailabilityChip: {
    height: 25,
    flexShrink: 0,
    borderRadius: "7px",
    fontSize: {
      xs: 11.5,
      lg: 12,
    },
    fontWeight: 740,
    border: "1px solid transparent",

    "& .MuiChip-label": {
      px: 0.8,
    },
  },

  /*
  El stock saludable se presenta como texto, sin cápsula,
  y conserva exactamente la misma escala que las métricas.
  */
  topProductsAvailabilityHealthyValue: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: {
      xs: 12.25,
      lg: 12.5,
    },
    fontWeight: 720,
    lineHeight: 1.25,
    color: colors.state.success,
  },

  topProductsAvailabilityHealthy: {
    color: colors.state.success,
    backgroundColor: greenSurface,
    borderColor: alpha(colors.state.success, 0.16),
  },

  /*
  El stock insuficiente utiliza rojo suave y no naranja.

  De esta manera comunica riesgo de reposición y coincide
  con el lenguaje visual de la referencia Premium.
  */
  topProductsAvailabilityWarning: {
    color: criticalForeground,
    backgroundColor: criticalSurface,
    borderColor: criticalBorder,
  },

  topProductsAvailabilityCritical: {
    color: "#B91C1C",
    backgroundColor: "#FBE3E3",
    borderColor: "#F3B8B8",
  },

  topProductsAvailabilityInactive: {
    color: colors.text.secondary,
    backgroundColor: neutralSurface,
    borderColor: neutralBorder,
  },

  topProductsAvailabilityLabel: {
    fontSize: 9.8,
    fontWeight: 500,
    lineHeight: 1.25,
    color: colors.text.muted,
    whiteSpace: "nowrap",
  },

  topProductsEmptyState: {
    minHeight: 210,
    px: 2,
    py: 3,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: "14px",
    backgroundColor: neutralSurface,
    border: `1px dashed ${colors.border.default}`,
  },

  topProductsEmptyIcon: {
    width: 50,
    height: 50,
    display: "grid",
    placeItems: "center",
    borderRadius: "14px",
    color: colors.brand.primary,
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,

    "& svg": {
      fontSize: 27,
    },
  },

  topProductsEmptyTitle: {
    mt: 1.15,
    fontSize: 14,
    fontWeight: 750,
    lineHeight: 1.3,
    color: colors.text.primary,
  },

  topProductsEmptyText: {
    maxWidth: 460,
    mt: 0.5,
    fontSize: 11.75,
    fontWeight: 400,
    lineHeight: 1.55,
    color: colors.text.secondary,
  },

  topProductsSkeletonList: {
    overflow: "hidden",
    borderRadius: "13px",
    border: `1px solid ${colors.border.default}`,
  },

  topProductsSkeletonRow: {
    minHeight: {
      xs: 94,
      lg: 72,
    },
    px: {
      xs: 1.4,
      lg: 1.75,
    },
    py: 1.25,
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      lg: topProductsColumns,
    },
    alignItems: "center",
    gap: 1.5,
    borderBottom: `1px solid ${colors.border.default}`,

    "&:last-of-type": {
      borderBottom: "none",
    },

    "& > span": {
      display: {
        xs: "none",
        lg: "block",
      },
    },
  },
} as const;
