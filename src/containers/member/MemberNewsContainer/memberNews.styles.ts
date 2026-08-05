import { alpha } from "@mui/material/styles";

import { colors } from "@/theme/colors";

/*
Estilos del módulo Novedades del Portal Socio.

Criterios aplicados:

- referencia visual Premium aprobada;
- continuidad con Mi perfil;
- continuidad con Productos disponibles;
- jerarquía clara entre presentación y noticias;
- diferenciación sutil de la última novedad;
- lectura cómoda con textos cortos o extensos;
- mobile first y responsive real;
- uso de tokens visuales existentes;
- sin elementos administrativos.
*/

/* =========================================================
   SUPERFICIES Y ELEVACIÓN
========================================================= */

const pageSurface = colors.background.surface;

const softSurface = "#F8FAF8";

const subtleBorder = alpha(colors.text.primary, 0.09);

const strongBorder = alpha(colors.brand.primary, 0.46);

const cardShadow = "0 14px 34px rgba(15, 39, 27, 0.045)";

const cardHoverShadow = "0 20px 46px rgba(15, 39, 27, 0.075)";

const latestCardShadow = "0 18px 44px rgba(47, 111, 70, 0.095)";

const heroShadow = "0 18px 46px rgba(15, 39, 27, 0.055)";

const stateCardShadow = "0 16px 40px rgba(15, 39, 27, 0.045)";

const errorSurface = alpha(colors.state.error, 0.075);

const errorBorder = alpha(colors.state.error, 0.16);

/* =========================================================
   ESTILOS DEL MÓDULO
========================================================= */

export const memberNewsStyles = {
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
      letterSpacing: "-0.005em",
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
     FEED
  ========================================================= */

  newsFeed: {
    width: "100%",
    minWidth: 0,
    display: "grid",
    alignItems: "start",
    gap: {
      xs: 2,
      sm: 2.25,
      md: 2.75,
    },
  },

  /* =========================================================
     PRESENTACIÓN DEL MÓDULO
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

  heroIllustration: {
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

  heroIllustrationRing: {
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

  newsCountChip: {
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
     LISTADO
  ========================================================= */

  newsList: {
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
     TARJETA DE NOVEDAD
  ========================================================= */

  newsCard: {
    position: "relative",
    width: "100%",
    minWidth: 0,
    p: {
      xs: 2.1,
      sm: 2.5,
      md: 3,
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "68px minmax(0, 1fr)",
      md: "76px minmax(0, 1fr)",
    },
    alignItems: "center",
    gap: {
      xs: 1.5,
      sm: 2.25,
      md: 2.75,
    },
    overflow: "visible",
    borderRadius: {
      xs: "18px",
      sm: "20px",
    },
    color: colors.text.primary,
    backgroundColor: pageSurface,
    border: `1px solid ${subtleBorder}`,
    boxShadow: cardShadow,
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",

    '&[data-latest="true"]': {
      borderColor: strongBorder,
      boxShadow: latestCardShadow,
    },

    "@media (hover: hover)": {
      "&:hover": {
        transform: "translateY(-2px)",
        borderColor: alpha(colors.brand.primary, 0.2),
        boxShadow: cardHoverShadow,
      },

      '&[data-latest="true"]:hover': {
        borderColor: colors.brand.primary,
        boxShadow: "0 22px 50px rgba(47, 111, 70, 0.13)",
      },
    },
  },

  latestBadge: {
    position: "absolute",
    top: {
      xs: -13,
      sm: -14,
    },
    left: {
      xs: 16,
      sm: 20,
    },
    height: {
      xs: 27,
      sm: 29,
    },
    px: {
      xs: 1.15,
      sm: 1.35,
    },
    display: "flex",
    alignItems: "center",
    gap: 0.6,
    borderRadius: "9px 9px 9px 3px",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    boxShadow: "0 7px 18px rgba(47, 111, 70, 0.2)",

    "& svg": {
      fontSize: {
        xs: 14,
        sm: 15,
      },
    },
  },

  latestBadgeText: {
    fontSize: {
      xs: 10.5,
      sm: 11,
    },
    fontWeight: 750,
    lineHeight: 1,
    letterSpacing: "-0.005em",
  },

  newsIconWrapper: {
    width: {
      xs: 50,
      sm: 68,
      md: 76,
    },
    height: {
      xs: 50,
      sm: 68,
      md: 76,
    },
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: {
      xs: "15px",
      sm: "19px",
      md: "21px",
    },
    color: colors.brand.primaryDark,
    background: `linear-gradient(
      145deg,
      ${alpha(colors.brand.primaryLight, 0.92)} 0%,
      ${alpha(colors.background.soft, 0.94)} 100%
    )`,
    border: `1px solid ${alpha(colors.brand.primary, 0.1)}`,

    "& svg": {
      fontSize: {
        xs: 25,
        sm: 30,
        md: 33,
      },
    },
  },

  newsCardContent: {
    minWidth: 0,
    display: "grid",
    alignContent: "start",
  },

  newsMetaRow: {
    minWidth: 0,
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
      xs: 1,
      sm: 1.5,
    },
  },

  newsDateRow: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    color: colors.text.secondary,
  },

  newsDateIcon: {
    flexShrink: 0,
    color: colors.text.muted,
    fontSize: {
      xs: 15,
      sm: 16,
    },
  },

  newsDate: {
    color: colors.text.secondary,
    fontSize: {
      xs: 11.75,
      sm: 12.25,
      md: 12.75,
    },
    fontWeight: 500,
    lineHeight: 1.4,
  },

  newsDateBadge: {
    display: {
      xs: "none",
      sm: "inline-flex",
    },
    height: 31,
    flexShrink: 0,
    borderRadius: "10px",
    color: colors.brand.primary,
    backgroundColor: alpha(colors.brand.primaryLight, 0.28),
    border: `1px solid ${alpha(colors.brand.primary, 0.11)}`,

    "& .MuiChip-icon": {
      ml: 0.9,
      mr: -0.35,
      color: colors.brand.primary,
      fontSize: 15,
    },

    "& .MuiChip-label": {
      px: 1.05,
      fontSize: 11.5,
      fontWeight: 650,
    },
  },

  newsTitle: {
    mt: {
      xs: 1,
      sm: 0.9,
    },
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 17,
      sm: 18.5,
      md: 20,
    },
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: {
      xs: 1.25,
      md: 1.2,
    },
    overflowWrap: "anywhere",
  },

  newsContent: {
    mt: {
      xs: 0.9,
      sm: 1,
    },
    mb: 0,
    maxWidth: 900,
    color: colors.text.secondary,
    fontSize: {
      xs: 13.25,
      sm: 13.75,
      md: 14.25,
    },
    fontWeight: 400,
    lineHeight: {
      xs: 1.6,
      sm: 1.65,
    },
    whiteSpace: "pre-line",
    overflowWrap: "anywhere",
  },

  /* =========================================================
     SKELETON DEL HERO
  ========================================================= */

  heroSkeletonCard: {
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
    borderRadius: {
      xs: "20px",
      sm: "24px",
    },
    backgroundColor: pageSurface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: heroShadow,
  },

  heroSkeletonIllustration: {
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
    borderRadius: {
      xs: "26px",
      sm: "36px",
      md: "44px",
    },
  },

  heroSkeletonCopy: {
    minWidth: 0,
    display: "grid",
    gap: 0.8,
  },

  /* =========================================================
     SKELETON DE TARJETAS
  ========================================================= */

  newsSkeletonCard: {
    width: "100%",
    minWidth: 0,
    p: {
      xs: 2.1,
      sm: 2.5,
      md: 3,
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "68px minmax(0, 1fr)",
      md: "76px minmax(0, 1fr)",
    },
    alignItems: "center",
    gap: {
      xs: 1.5,
      sm: 2.25,
      md: 2.75,
    },
    borderRadius: {
      xs: "18px",
      sm: "20px",
    },
    backgroundColor: pageSurface,
    border: `1px solid ${subtleBorder}`,
    boxShadow: cardShadow,
  },

  newsSkeletonIcon: {
    width: {
      xs: 50,
      sm: 68,
      md: 76,
    },
    height: {
      xs: 50,
      sm: 68,
      md: 76,
    },
    borderRadius: {
      xs: "15px",
      sm: "19px",
      md: "21px",
    },
    backgroundColor: alpha(colors.brand.primary, 0.08),
  },

  newsSkeletonContent: {
    minWidth: 0,
    display: "grid",
    gap: 0.65,
  },

  newsSkeletonText: {
    mt: 0.5,
    display: "grid",
    gap: 0.15,
  },

  /* =========================================================
     ESTADOS VACÍO Y ERROR
  ========================================================= */

  newsStateCard: {
    width: "100%",
    minHeight: {
      xs: 280,
      sm: 310,
    },
    px: {
      xs: 2.25,
      sm: 4,
    },
    py: {
      xs: 4.5,
      sm: 5.5,
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: {
      xs: "18px",
      sm: "20px",
    },
    color: colors.text.primary,
    backgroundColor: pageSurface,
    border: `1px solid ${subtleBorder}`,
    boxShadow: stateCardShadow,
  },

  newsStateIcon: {
    width: {
      xs: 58,
      sm: 64,
    },
    height: {
      xs: 58,
      sm: 64,
    },
    display: "grid",
    placeItems: "center",
    borderRadius: {
      xs: "17px",
      sm: "19px",
    },
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primaryLight, 0.8),
    border: `1px solid ${alpha(colors.brand.primary, 0.11)}`,

    "& svg": {
      fontSize: {
        xs: 29,
        sm: 32,
      },
    },
  },

  newsErrorIcon: {
    color: colors.state.error,
    backgroundColor: errorSurface,
    border: `1px solid ${errorBorder}`,
  },

  newsStateTitle: {
    mt: 2,
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 19,
      sm: 21,
    },
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
  },

  newsStateDescription: {
    maxWidth: 540,
    mt: 1,
    mb: 0,
    color: colors.text.secondary,
    fontSize: {
      xs: 13,
      sm: 13.75,
    },
    fontWeight: 400,
    lineHeight: 1.65,
  },

  retryButton: {
    minHeight: 44,
    mt: 2.25,
    px: 2.25,
    borderRadius: "12px",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    textTransform: "none",
    fontSize: 13,
    fontWeight: 700,
    boxShadow: "0 8px 20px rgba(47, 111, 70, 0.16)",

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 10px 24px rgba(18, 51, 34, 0.18)",
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.brand.primary, 0.2)}`,
      outlineOffset: 2,
    },

    "&.Mui-disabled": {
      color: colors.text.muted,
      backgroundColor: softSurface,
      boxShadow: "none",
    },
  },
};
