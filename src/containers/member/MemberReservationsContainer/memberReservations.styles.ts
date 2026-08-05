import { alpha } from "@mui/material/styles";

import { colors } from "@/theme/colors";

/* =========================================================
   CONSTANTES VISUALES
========================================================= */

const surface = colors.background.surface;
const softSurface = "#F8FAF8";

const subtleBorder = alpha(colors.text.primary, 0.09);

const cardShadow = "0 14px 36px rgba(15, 39, 27, 0.045)";

const cardHoverShadow = "0 20px 48px rgba(15, 39, 27, 0.075)";

const heroShadow = "0 18px 48px rgba(15, 39, 27, 0.055)";

const drawerShadow = "-18px 0 54px rgba(15, 39, 27, 0.12)";

/* =========================================================
   ESTILOS
========================================================= */

export const memberReservationsStyles = {
  /* =========================================================
     ESTRUCTURA GENERAL
  ========================================================= */

  root: {
    width: "100%",
    maxWidth: 1320,
    minWidth: 0,
    mx: "auto",
  },

  pageStack: {
    width: "100%",
    minWidth: 0,
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
    backgroundColor: softSurface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 4px 14px rgba(15, 39, 27, 0.025)",

    "& .MuiChip-icon": {
      ml: 1.05,
      color: colors.brand.primary,
      fontSize: 17,
    },

    "& .MuiChip-label": {
      px: 1.25,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: 12,
      fontWeight: 650,
    },
  },

  nonBlockingAlert: {
    borderRadius: "14px",
    color: colors.text.primary,
    backgroundColor: alpha(colors.state.warning, 0.075),
    border: `1px solid ${alpha(colors.state.warning, 0.2)}`,

    "& .MuiAlert-icon": {
      color: colors.state.warning,
    },

    "& .MuiAlert-message": {
      fontSize: 13,
      fontWeight: 500,
      lineHeight: 1.55,
    },
  },

  /* =========================================================
     HERO
  ========================================================= */

  heroCard: {
    position: "relative",
    width: "100%",
    minWidth: 0,
    p: {
      xs: 2.25,
      sm: 3,
      md: 3.75,
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "150px minmax(0, 1fr)",
      md: "190px minmax(0, 1fr)",
    },
    alignItems: "center",
    gap: {
      xs: 2,
      sm: 3,
      md: 4,
    },
    overflow: "hidden",
    borderRadius: {
      xs: "20px",
      sm: "24px",
    },
    color: colors.text.primary,
    background: `linear-gradient(
      115deg,
      ${colors.background.surface} 0%,
      ${alpha(colors.background.soft, 0.72)} 100%
    )`,
    border: `1px solid ${colors.border.default}`,
    boxShadow: heroShadow,
  },

  heroDecorationPrimary: {
    position: "absolute",
    right: {
      xs: -44,
      sm: -28,
      md: -8,
    },
    bottom: {
      xs: -54,
      sm: -64,
      md: -70,
    },
    width: {
      xs: 150,
      sm: 190,
      md: 230,
    },
    height: {
      xs: 150,
      sm: 190,
      md: 230,
    },
    borderRadius: "50%",
    backgroundColor: alpha(colors.brand.primaryLight, 0.34),
    pointerEvents: "none",
  },

  heroDecorationSecondary: {
    position: "absolute",
    right: {
      xs: 36,
      sm: 62,
      md: 92,
    },
    top: {
      xs: -32,
      sm: -42,
      md: -58,
    },
    width: {
      xs: 92,
      sm: 118,
      md: 142,
    },
    height: {
      xs: 92,
      sm: 118,
      md: 142,
    },
    borderRadius: "52% 48% 62% 38%",
    transform: "rotate(28deg)",
    backgroundColor: alpha(colors.brand.accent, 0.13),
    pointerEvents: "none",
  },

  heroIcon: {
    position: "relative",
    zIndex: 1,
    width: {
      xs: 92,
      sm: 132,
      md: 158,
    },
    height: {
      xs: 92,
      sm: 132,
      md: 158,
    },
    mx: {
      xs: 0,
      sm: "auto",
    },
    display: "grid",
    placeItems: "center",
    borderRadius: {
      xs: "26px",
      sm: "36px",
      md: "44px",
    },
    background: `linear-gradient(
      145deg,
      ${alpha(colors.brand.primaryLight, 0.95)} 0%,
      ${alpha(colors.background.soft, 0.88)} 100%
    )`,
    border: `1px solid ${alpha(colors.brand.primary, 0.1)}`,
    boxShadow: "0 16px 34px rgba(47, 111, 70, 0.1)",
  },

  heroIconRing: {
    width: {
      xs: 58,
      sm: 78,
      md: 94,
    },
    height: {
      xs: 58,
      sm: 78,
      md: 94,
    },
    display: "grid",
    placeItems: "center",
    borderRadius: {
      xs: "17px",
      sm: "23px",
      md: "27px",
    },
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.background.surface, 0.58),
    border: `2px solid ${alpha(colors.brand.primary, 0.18)}`,

    "& svg": {
      fontSize: {
        xs: 34,
        sm: 47,
        md: 56,
      },
    },
  },

  heroCopy: {
    position: "relative",
    zIndex: 1,
    minWidth: 0,
    maxWidth: 760,
    display: "grid",
    justifyItems: "start",
  },

  heroTitle: {
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 23,
      sm: 27,
      md: 31,
    },
    fontWeight: 800,
    letterSpacing: "-0.04em",
    lineHeight: 1.08,
  },

  heroDescription: {
    maxWidth: 660,
    mt: {
      xs: 1,
      sm: 1.25,
    },
    mb: 0,
    color: colors.text.secondary,
    fontSize: {
      xs: 13.5,
      sm: 14.25,
      md: 15,
    },
    fontWeight: 400,
    lineHeight: {
      xs: 1.6,
      sm: 1.65,
    },
  },

  heroCountChip: {
    width: "fit-content",
    height: {
      xs: 34,
      sm: 36,
    },
    mt: {
      xs: 1.75,
      sm: 2,
    },
    flexShrink: 0,
    borderRadius: "11px",
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.background.surface, 0.9),
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 6px 18px rgba(15, 39, 27, 0.035)",

    "& .MuiChip-icon": {
      ml: 1.1,
      mr: -0.25,
      color: colors.state.success,
      fontSize: 10,
    },

    "& .MuiChip-label": {
      px: 1.3,
      fontSize: {
        xs: 11.75,
        sm: 12.25,
      },
      fontWeight: 700,
      letterSpacing: "-0.005em",
    },
  },

  /* =========================================================
     TABS
  ========================================================= */

  tabsCard: {
    width: "100%",
    minWidth: 0,
    px: {
      xs: 0.5,
      sm: 1,
    },
    borderBottom: `1px solid ${colors.border.default}`,
  },

  tabs: {
    minHeight: 50,

    "& .MuiTabs-flexContainer": {
      justifyContent: "flex-start",
      gap: {
        xs: 0,
        sm: 1,
      },
    },

    "& .MuiTabs-indicator": {
      height: 3,
      borderRadius: "3px 3px 0 0",
      backgroundColor: colors.brand.primary,
    },
  },

  tab: {
    minWidth: {
      xs: "50%",
      sm: 170,
    },
    minHeight: 50,
    px: {
      xs: 1,
      sm: 2,
    },
    color: colors.text.secondary,
    textTransform: "none",

    "&.Mui-selected": {
      color: colors.brand.primaryDark,
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.brand.primary, 0.16)}`,
      outlineOffset: -3,
    },
  },

  tabLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: {
      xs: 0.65,
      sm: 0.8,
    },
  },

  tabIcon: {
    display: "grid",
    placeItems: "center",

    "& svg": {
      fontSize: {
        xs: 18,
        sm: 19,
      },
    },
  },

  tabText: {
    fontSize: {
      xs: 12.5,
      sm: 13.25,
    },
    fontWeight: 700,
  },

  tabCount: {
    minWidth: 25,
    height: 24,
    px: 0.75,
    display: "grid",
    placeItems: "center",
    borderRadius: "8px",
    color: colors.text.secondary,
    backgroundColor: alpha(colors.text.primary, 0.055),
    fontSize: 11,
    fontWeight: 750,

    ".Mui-selected &": {
      color: colors.brand.primary,
      backgroundColor: alpha(colors.brand.primaryLight, 0.68),
    },
  },

  /* =========================================================
     LISTADO Y PANELES
  ========================================================= */

  tabPanel: {
    width: "100%",
    minWidth: 0,
  },

  reservationsList: {
    width: "100%",
    minWidth: 0,
    display: "grid",
    gap: {
      xs: 1.5,
      sm: 1.75,
      md: 2,
    },
  },

  /* =========================================================
     BADGES DE ESTADO
  ========================================================= */

  statusBadge: {
    width: "fit-content",
    maxWidth: "100%",
    height: 31,
    flexShrink: 0,
    borderRadius: "10px",
    border: "1px solid transparent",

    "& .MuiChip-icon": {
      ml: 0.85,
      mr: -0.3,
      fontSize: 16,
    },

    "& .MuiChip-label": {
      px: 1.05,
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: 11.5,
      fontWeight: 700,
    },
  },

  statusBadgeCompact: {
    height: 27,

    "& .MuiChip-icon": {
      fontSize: 14,
    },

    "& .MuiChip-label": {
      px: 0.85,
      fontSize: 10.5,
    },
  },

  statusConfirmed: {
    color: colors.state.success,
    backgroundColor: alpha(colors.state.success, 0.11),
    borderColor: alpha(colors.state.success, 0.16),

    "& .MuiChip-icon": {
      color: colors.state.success,
    },
  },

  statusCompleted: {
    color: colors.brand.primary,
    backgroundColor: alpha(colors.brand.primaryLight, 0.55),
    borderColor: alpha(colors.brand.primary, 0.13),

    "& .MuiChip-icon": {
      color: colors.brand.primary,
    },
  },

  statusRejected: {
    color: colors.state.error,
    backgroundColor: alpha(colors.state.error, 0.09),
    borderColor: alpha(colors.state.error, 0.15),

    "& .MuiChip-icon": {
      color: colors.state.error,
    },
  },

  statusCancelled: {
    color: colors.state.error,
    backgroundColor: alpha(colors.state.error, 0.07),
    borderColor: alpha(colors.state.error, 0.13),

    "& .MuiChip-icon": {
      color: colors.state.error,
    },
  },

  statusExpired: {
    color: colors.text.secondary,
    backgroundColor: alpha(colors.state.warning, 0.09),
    borderColor: alpha(colors.state.warning, 0.17),

    "& .MuiChip-icon": {
      color: colors.state.warning,
    },
  },

  statusProcessing: {
    color: "#9A6500",
    backgroundColor: alpha(colors.state.warning, 0.13),
    borderColor: alpha(colors.state.warning, 0.2),

    "& .MuiChip-icon": {
      color: colors.state.warning,
    },
  },

  /* =========================================================
     CARD DE RESERVA
  ========================================================= */

  reservationCard: {
    position: "relative",
    width: "100%",
    minWidth: 0,
    overflow: "hidden",
    borderRadius: {
      xs: "18px",
      sm: "20px",
    },
    backgroundColor: surface,
    border: `1px solid ${subtleBorder}`,
    boxShadow: cardShadow,
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",

    '&[data-status="CONFIRMADA"]': {
      borderColor: alpha(colors.state.success, 0.4),
      boxShadow: "0 16px 38px rgba(47, 111, 70, 0.075)",
    },

    '&[data-status="PENDIENTE"]': {
      borderColor: alpha(colors.state.warning, 0.28),
    },

    "@media (hover: hover)": {
      "&:hover": {
        transform: "translateY(-2px)",
        borderColor: alpha(colors.brand.primary, 0.2),
        boxShadow: cardHoverShadow,
      },
    },
  },

  reservationCardHeader: {
    p: {
      xs: 1.75,
      sm: 2.25,
    },
    pb: {
      xs: 1.4,
      sm: 1.65,
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
    gap: 1.25,
  },

  reservationIdentity: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 1.25,
  },

  reservationIdentityIcon: {
    width: {
      xs: 48,
      sm: 54,
    },
    height: {
      xs: 48,
      sm: 54,
    },
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: {
      xs: "14px",
      sm: "16px",
    },
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primaryLight, 0.6),
    border: `1px solid ${alpha(colors.brand.primary, 0.1)}`,

    "& svg": {
      fontSize: {
        xs: 24,
        sm: 27,
      },
    },
  },

  reservationIdentityCopy: {
    minWidth: 0,
  },

  reservationNumber: {
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 16,
      sm: 17.5,
    },
    fontWeight: 800,
    letterSpacing: "-0.025em",
    lineHeight: 1.25,
  },

  reservationRequestDate: {
    display: "block",
    mt: 0.35,
    color: colors.text.secondary,
    fontSize: {
      xs: 11.5,
      sm: 12,
    },
    lineHeight: 1.4,
  },

  reservationCardBody: {
    px: {
      xs: 1.75,
      sm: 2.25,
    },
    pb: {
      xs: 1.5,
      sm: 1.75,
    },
    display: "grid",
    gap: 1.5,
  },

  productsSummary: {
    minWidth: 0,
    p: {
      xs: 1.4,
      sm: 1.6,
    },
    borderRadius: "14px",
    backgroundColor: softSurface,
    border: `1px solid ${subtleBorder}`,
  },

  productsCount: {
    display: "block",
    color: colors.brand.primaryDark,
    fontSize: 11.5,
    fontWeight: 750,
  },

  productsPreview: {
    mt: 0.55,
    mb: 0,
    color: colors.text.secondary,
    fontSize: {
      xs: 12.5,
      sm: 13,
    },
    lineHeight: 1.55,
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
  },

  reservationMetrics: {
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(2, minmax(0, 1fr))",
    },
    gap: 1,
  },

  reservationMetric: {
    minWidth: 0,
    minHeight: 70,
    p: 1.35,
    display: "flex",
    alignItems: "center",
    gap: 1,
    borderRadius: "14px",
    backgroundColor: alpha(colors.background.soft, 0.45),
    border: `1px solid ${subtleBorder}`,

    "& > svg": {
      flexShrink: 0,
      color: colors.brand.primary,
      fontSize: 21,
    },
  },

  reservationMetricLabel: {
    display: "block",
    color: colors.text.secondary,
    fontSize: 10.75,
    fontWeight: 550,
  },

  reservationMetricValue: {
    display: "block",
    mt: 0.25,
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 15.5,
      sm: 16.5,
    },
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },

  functionalNoticeCopy: {
    minWidth: 0,
  },

  functionalNoticeLabel: {
    display: "block",
    color: colors.text.secondary,
    fontSize: 10.75,
    fontWeight: 550,
  },

  withdrawalNotice: {
    p: 1.4,
    display: "flex",
    alignItems: "center",
    gap: 1.1,
    borderRadius: "14px",
    color: colors.text.primary,
    backgroundColor: alpha(colors.state.success, 0.07),
    border: `1px solid ${alpha(colors.state.success, 0.15)}`,
  },

  withdrawalNoticeIcon: {
    width: 38,
    height: 38,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "11px",
    color: colors.state.success,
    backgroundColor: alpha(colors.state.success, 0.1),

    "& svg": {
      fontSize: 21,
    },
  },

  withdrawalNoticeValue: {
    display: "block",
    mt: 0.2,
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 12.25,
      sm: 13,
    },
    fontWeight: 750,
    lineHeight: 1.4,
  },

  processingNotice: {
    p: 1.4,
    display: "flex",
    alignItems: "center",
    gap: 1.1,
    borderRadius: "14px",
    backgroundColor: alpha(colors.state.warning, 0.075),
    border: `1px solid ${alpha(colors.state.warning, 0.16)}`,
  },

  processingNoticeIcon: {
    width: 38,
    height: 38,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "11px",
    color: colors.state.warning,
    backgroundColor: alpha(colors.state.warning, 0.11),

    "& svg": {
      fontSize: 21,
    },
  },

  processingNoticeValue: {
    display: "block",
    mt: 0.2,
    color: colors.text.primary,
    fontSize: {
      xs: 12.25,
      sm: 13,
    },
    fontWeight: 700,
  },

  reservationReason: {
    p: 1.4,
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    borderRadius: "14px",
    backgroundColor: softSurface,
    border: `1px solid ${subtleBorder}`,
  },

  reservationReasonIcon: {
    mt: 0.1,
    flexShrink: 0,
    color: colors.text.muted,
    fontSize: 20,
  },

  reservationReasonText: {
    mt: 0.25,
    mb: 0,
    color: colors.text.secondary,
    fontSize: 12.25,
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },

  reservationCardFooter: {
    px: {
      xs: 1.75,
      sm: 2.25,
    },
    py: 1.25,
    display: "flex",
    justifyContent: "flex-end",
    borderTop: `1px solid ${subtleBorder}`,
  },

  viewDetailButton: {
    minHeight: 38,
    px: 1.25,
    borderRadius: "10px",
    color: colors.brand.primaryDark,
    textTransform: "none",
    fontSize: 12.5,
    fontWeight: 750,

    "&:hover": {
      backgroundColor: alpha(colors.brand.primaryLight, 0.45),
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.brand.primary, 0.16)}`,
      outlineOffset: 1,
    },
  },

  /* =========================================================
     ESTADOS DE LISTADO
  ========================================================= */

  emptyState: {
    minHeight: {
      xs: 270,
      sm: 300,
    },
    px: {
      xs: 2,
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
    backgroundColor: surface,
    border: `1px solid ${subtleBorder}`,
    boxShadow: cardShadow,
  },

  emptyStateIcon: {
    width: 62,
    height: 62,
    display: "grid",
    placeItems: "center",
    borderRadius: "18px",
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primaryLight, 0.65),

    "& svg": {
      fontSize: 31,
    },
  },

  emptyStateTitle: {
    mt: 1.75,
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 18.5,
      sm: 20,
    },
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },

  emptyStateDescription: {
    maxWidth: 520,
    mt: 0.8,
    mb: 0,
    color: colors.text.secondary,
    fontSize: {
      xs: 12.75,
      sm: 13.5,
    },
    lineHeight: 1.6,
  },

  /* =========================================================
     DRAWER DE DETALLE
  ========================================================= */

  detailDrawerPaper: {
    width: {
      sm: 480,
      md: 520,
    },
    maxWidth: "100vw",
    backgroundColor: surface,
    boxShadow: drawerShadow,
  },

  detailDrawerPaperMobile: {
    width: "100%",
    maxHeight: "92dvh",
    overflow: "hidden",
    borderRadius: "22px 22px 0 0",
    backgroundColor: surface,
    boxShadow: "0 -18px 50px rgba(15, 39, 27, 0.14)",
  },

  detailDrawerHeader: {
    minHeight: 78,
    px: {
      xs: 2,
      sm: 2.5,
    },
    py: 1.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
  },

  detailEyebrow: {
    display: "block",
    color: colors.brand.primary,
    fontSize: 10.5,
    fontWeight: 750,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  detailDrawerTitle: {
    display: "block",
    mt: 0.25,
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 18,
      sm: 20,
    },
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },

  detailCloseButton: {
    flexShrink: 0,
    color: colors.text.secondary,
    border: `1px solid ${subtleBorder}`,

    "&:hover": {
      color: colors.brand.primaryDark,
      backgroundColor: alpha(colors.brand.primaryLight, 0.42),
    },
  },

  detailDrawerBody: {
    height: "100%",
    overflowY: "auto",
    overscrollBehavior: "contain",
  },

  detailContent: {
    p: {
      xs: 2,
      sm: 2.5,
    },
    display: "grid",
    gap: 2,
  },

  detailHeading: {
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
    gap: 1.25,
  },

  detailReservationIdentity: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 1.2,
  },

  detailReservationIcon: {
    width: 48,
    height: 48,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "14px",
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primaryLight, 0.6),

    "& svg": {
      fontSize: 24,
    },
  },

  detailTitle: {
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 18,
      sm: 20,
    },
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
  },

  detailRequestDate: {
    display: "block",
    mt: 0.35,
    color: colors.text.secondary,
    fontSize: 11.5,
  },

  detailDivider: {
    borderColor: subtleBorder,
  },

  detailSection: {
    minWidth: 0,
  },

  detailSectionTitle: {
    color: colors.brand.primaryDark,
    fontSize: 15.5,
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },

  detailProductsList: {
    p: 0,
    m: 0,
    mt: 1.25,
    display: "grid",
    gap: 1,
    listStyle: "none",
  },

  detailProductCard: {
    minWidth: 0,
    p: 1.25,
    display: "grid",
    gridTemplateColumns: {
      xs: "54px minmax(0, 1fr)",
      sm: "62px minmax(0, 1fr) auto",
    },
    alignItems: "center",
    gap: 1.15,
    borderRadius: "14px",
    backgroundColor: softSurface,
    border: `1px solid ${subtleBorder}`,
  },

  detailProductImage: {
    width: {
      xs: 54,
      sm: 62,
    },
    height: {
      xs: 54,
      sm: 62,
    },
    objectFit: "cover",
    borderRadius: "12px",
    border: `1px solid ${subtleBorder}`,
  },

  detailProductImageFallback: {
    width: {
      xs: 54,
      sm: 62,
    },
    height: {
      xs: 54,
      sm: 62,
    },
    display: "grid",
    placeItems: "center",
    borderRadius: "12px",
    color: colors.text.muted,
    backgroundColor: alpha(colors.text.primary, 0.04),
    border: `1px solid ${subtleBorder}`,

    "& svg": {
      fontSize: 23,
    },
  },

  detailProductCopy: {
    minWidth: 0,
  },

  detailProductName: {
    color: colors.brand.primaryDark,
    fontSize: 13.5,
    fontWeight: 750,
    lineHeight: 1.3,
    overflowWrap: "anywhere",
  },

  detailProductQuantity: {
    display: "block",
    mt: 0.3,
    color: colors.brand.primary,
    fontSize: 11.25,
    fontWeight: 650,
  },

  detailProductUnitPrice: {
    display: "block",
    mt: 0.15,
    color: colors.text.secondary,
    fontSize: 10.75,
  },

  detailProductSubtotal: {
    gridColumn: {
      xs: "1 / -1",
      sm: "auto",
    },
    justifySelf: {
      xs: "end",
      sm: "auto",
    },
    color: colors.brand.primaryDark,
    fontSize: 13.5,
    fontWeight: 800,
  },

  detailSummary: {
    p: 1.5,
    display: "grid",
    gap: 1.25,
    borderRadius: "15px",
    backgroundColor: softSurface,
    border: `1px solid ${subtleBorder}`,
  },

  detailSummaryRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.5,

    "& + &": {
      pt: 1.25,
      borderTop: `1px solid ${subtleBorder}`,
    },
  },

  detailSummaryLabel: {
    display: "flex",
    alignItems: "center",
    gap: 0.8,
    color: colors.text.secondary,
    fontSize: 12,

    "& svg": {
      color: colors.brand.primary,
      fontSize: 19,
    },
  },

  detailSummaryValue: {
    color: colors.brand.primaryDark,
    fontSize: 14,
    fontWeight: 800,
  },

  detailSummaryTotal: {
    color: colors.state.success,
    fontSize: 16,
    fontWeight: 800,
  },

  detailDates: {
    display: "grid",
    gap: 1,
  },

  detailDateItem: {
    p: 1.25,
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    borderRadius: "13px",
    border: `1px solid ${subtleBorder}`,

    "& > svg": {
      mt: 0.1,
      flexShrink: 0,
      color: colors.brand.primary,
      fontSize: 20,
    },
  },

  detailDateLabel: {
    display: "block",
    color: colors.text.secondary,
    fontSize: 10.75,
  },

  detailDateValue: {
    display: "block",
    mt: 0.25,
    color: colors.brand.primaryDark,
    fontSize: 12.25,
    fontWeight: 700,
  },

  detailWithdrawalNotice: {
    p: 1.4,
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    borderRadius: "14px",
    backgroundColor: alpha(colors.state.success, 0.07),
    border: `1px solid ${alpha(colors.state.success, 0.15)}`,

    "& > svg": {
      flexShrink: 0,
      color: colors.state.success,
      fontSize: 21,
    },
  },

  detailReasonNotice: {
    p: 1.4,
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    borderRadius: "14px",
    backgroundColor: softSurface,
    border: `1px solid ${subtleBorder}`,

    "& > svg": {
      flexShrink: 0,
      color: colors.text.muted,
      fontSize: 20,
    },
  },

  detailNoticeLabel: {
    display: "block",
    color: colors.text.secondary,
    fontSize: 10.75,
  },

  detailNoticeValue: {
    display: "block",
    mt: 0.25,
    color: colors.brand.primaryDark,
    fontSize: 12.5,
    fontWeight: 750,
  },

  detailReasonText: {
    mt: 0.3,
    mb: 0,
    color: colors.text.secondary,
    fontSize: 12.25,
    lineHeight: 1.5,
  },

  detailCancellationNotice: {
    borderRadius: "14px",
    color: colors.text.primary,
    backgroundColor: alpha(colors.brand.primary, 0.055),
    border: `1px solid ${alpha(colors.brand.primary, 0.13)}`,

    "& .MuiAlert-icon": {
      color: colors.brand.primary,
    },

    "& .MuiAlert-message": {
      fontSize: 12.25,
      lineHeight: 1.55,
    },
  },

  /* =========================================================
     LOADING Y ERROR DEL DETALLE
  ========================================================= */

  detailLoading: {
    p: {
      xs: 2,
      sm: 2.5,
    },
    display: "grid",
    gap: 1.5,
  },

  detailProductSkeleton: {
    display: "grid",
    gridTemplateColumns: "62px minmax(0, 1fr) auto",
    alignItems: "center",
    gap: 1.1,
  },

  detailProductSkeletonCopy: {
    minWidth: 0,
    display: "grid",
    gap: 0.2,
  },

  detailErrorState: {
    minHeight: 260,
    p: {
      xs: 2,
      sm: 2.5,
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    gap: 1.5,
  },

  detailErrorAlert: {
    borderRadius: "14px",
  },

  detailRetryButton: {
    alignSelf: "center",
    minHeight: 42,
    px: 2,
    borderRadius: "12px",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    textTransform: "none",
    fontSize: 12.5,
    fontWeight: 700,

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
    },
  },
};
