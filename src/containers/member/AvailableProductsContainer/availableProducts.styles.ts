import { alpha, type Theme } from "@mui/material/styles";

import { colors } from "@/theme/colors";

/* =========================================================
   SUPERFICIES Y ELEVACIÓN
========================================================= */

const pageBackground = colors.background.surface;
const softSurface = "#F7FAF7";
const mutedSurface = "#F3F7F3";

const subtleBorder = alpha(colors.text.primary, 0.1);

const subtleDivider = alpha(colors.text.primary, 0.085);

const productCardShadow = "0 10px 28px rgba(15, 39, 27, 0.035)";

const productCardHoverShadow = "0 18px 40px rgba(15, 39, 27, 0.075)";

const reservationPanelShadow = "0 18px 52px rgba(15, 39, 27, 0.075)";

const successSurface = alpha(colors.state.success, 0.085);

const successBorder = alpha(colors.state.success, 0.18);

const warningSurface = alpha(colors.state.warning, 0.085);

const warningBorder = alpha(colors.state.warning, 0.2);

const errorSurface = alpha(colors.state.error, 0.075);

const errorBorder = alpha(colors.state.error, 0.18);

export const availableProductsStyles = {
  /* =========================================================
     ESTRUCTURA GENERAL DEL MÓDULO
  ========================================================= */

  root: {
    width: "auto",
    minWidth: 0,
    minHeight: {
      xs: "calc(100vh - 70px)",
      md: "calc(100vh - 78px)",
    },

    /*
  Compensa el padding exterior aplicado por
  AuthenticatedLayout.content para que todo el
  canvas de este módulo sea blanco.

  Luego reincorpora internamente el mismo
  espacio, sin modificar el layout compartido.
  */
    mx: {
      xs: -2,
      md: -3,
      xl: -3.5,
    },
    mt: {
      xs: -2,
      md: -3,
    },
    mb: {
      xs: -3,
      md: -3.5,
    },

    px: {
      xs: 2,
      md: 3,
      xl: 3.5,
    },
    pt: {
      xs: 2,
      md: 3,
    },
    pb: {
      xs: 3,
      md: 3.5,
    },

    backgroundColor: colors.background.surface,
    boxSizing: "border-box",
    overflowX: "clip",
  },

  pageStack: {
    width: "100%",
    maxWidth: 1580,
    minWidth: 0,
    mx: "auto",
    display: "grid",
    gap: {
      xs: 2,
      md: 2.5,
    },
  },

  pageHeader: {
    minWidth: 0,
    display: "grid",
    gap: 0.7,
  },

  pageTitle: {
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 28,
      sm: 31,
      md: 34,
    },
    fontWeight: 800,
    letterSpacing: "-0.045em",
    lineHeight: 1.05,
  },

  pageSubtitle: {
    maxWidth: 760,
    color: colors.text.secondary,
    fontSize: {
      xs: 13.5,
      sm: 14,
    },
    fontWeight: 450,
    lineHeight: 1.55,
  },

  updatedAtChip: {
    height: 36,
    maxWidth: 270,
    flexShrink: 0,
    borderRadius: "12px",
    color: colors.brand.primaryDark,
    backgroundColor: pageBackground,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 4px 16px rgba(15, 39, 27, 0.025)",

    "& .MuiChip-icon": {
      ml: 1.1,
      color: colors.brand.primary,
      fontSize: 17,
    },

    "& .MuiChip-label": {
      px: 1.3,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: 12,
      fontWeight: 650,
      letterSpacing: "-0.005em",
    },
  },

  contentGrid: {
    width: "100%",
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      lg: "minmax(0, 1fr) 340px",
      xl: "minmax(0, 1fr) 380px",
    },
    alignItems: "start",
    gap: {
      xs: 2,
      lg: 3,
      xl: 3.5,
    },
  },

  catalogColumn: {
    width: "100%",
    minWidth: 0,
  },

  draftColumn: {
    width: "100%",
    maxWidth: {
      lg: 340,
      xl: 380,
    },
    minWidth: 0,
    display: {
      xs: "none",
      lg: "block",
    },
  },

  draftStickyWrapper: {
    position: "sticky",
    top: 98,
  },

  /* =========================================================
     ALERTAS
  ========================================================= */

  memberStatusAlert: {
    borderRadius: "14px",
    color: colors.text.primary,
    backgroundColor: warningSurface,
    border: `1px solid ${warningBorder}`,

    "& .MuiAlert-icon": {
      color: colors.state.warning,
    },

    "& .MuiAlert-message": {
      fontSize: 13,
      fontWeight: 500,
      lineHeight: 1.55,
    },
  },

  nonBlockingAlert: {
    borderRadius: "14px",
    color: colors.text.primary,
    backgroundColor: warningSurface,
    border: `1px solid ${warningBorder}`,

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
     ENCABEZADO Y GRILLA DEL CATÁLOGO
  ========================================================= */

  catalogSection: {
    width: "100%",
    maxWidth: "none",
    minWidth: 0,
  },

  catalogHeader: {
    mb: {
      xs: 1.75,
      md: 2,
    },
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
  },

  catalogHeaderCopy: {
    minWidth: 0,
  },

  catalogTitle: {
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 20,
      sm: 22,
      md: 23,
    },
    fontWeight: 800,
    letterSpacing: "-0.035em",
    lineHeight: 1.12,
  },

  catalogSubtitle: {
    mt: 0.6,
    color: colors.text.secondary,
    fontSize: {
      xs: 12.75,
      sm: 13.25,
    },
    fontWeight: 450,
    lineHeight: 1.55,
  },

  catalogCountChip: {
    height: 34,
    flexShrink: 0,
    borderRadius: "11px",
    color: colors.brand.primaryDark,
    backgroundColor: pageBackground,
    border: `1px solid ${colors.border.default}`,
    boxShadow: "0 4px 14px rgba(15, 39, 27, 0.02)",

    "& .MuiChip-label": {
      px: 1.25,
      fontSize: 11.75,
      fontWeight: 700,
    },
  },

  catalogGrid: {
    width: "100%",
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(2, minmax(0, 1fr))",
      md: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(3, minmax(0, 1fr))",
    },
    alignItems: "stretch",
    gap: {
      xs: 2,
      sm: 2.25,
      lg: 2.25,
      xl: 2.5,
    },
  },

  /* =========================================================
     TARJETA PREMIUM DE PRODUCTO
  ========================================================= */

  productCard: (isSelected: boolean) => ({
    minWidth: 0,
    minHeight: {
      sm: 450,
      lg: 465,
      xl: 475,
    },
    height: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px",
    backgroundColor: pageBackground,
    border: `1px solid ${
      isSelected ? alpha(colors.brand.primary, 0.52) : subtleBorder
    }`,
    boxShadow: isSelected
      ? `0 14px 34px ${alpha(colors.brand.primary, 0.09)}`
      : productCardShadow,
    transition:
      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",

    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: alpha(colors.brand.primary, isSelected ? 0.58 : 0.3),
      boxShadow: productCardHoverShadow,
    },
  }),

  productImageWrapper: {
    position: "relative",
    width: "auto",
    height: {
      xs: 156,
      sm: 162,
      lg: 172,
      xl: 182,
    },
    mx: {
      xs: 1.4,
      lg: 1.5,
    },
    mt: {
      xs: 1.4,
      lg: 1.5,
    },
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: mutedSurface,
  },

  productImage: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    objectPosition: "center",
    transition: "transform 240ms ease",

    ".MuiCard-root:hover &": {
      transform: "scale(1.018)",
    },
  },

  productImageFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 0.9,
    color: colors.brand.primary,
    background: `linear-gradient(
      145deg,
      ${mutedSurface} 0%,
      ${alpha(colors.brand.primaryLight, 0.72)} 100%
    )`,

    "& svg": {
      fontSize: 50,
    },
  },

  productImageFallbackText: {
    color: colors.text.secondary,
    fontSize: 11.75,
    fontWeight: 600,
  },

  selectedProductIndicator: {
    position: "absolute",
    top: 11,
    right: 11,
    width: 30,
    height: 30,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    border: `2px solid ${pageBackground}`,
    boxShadow: "0 7px 18px rgba(47, 111, 70, 0.22)",

    "& svg": {
      fontSize: 18,
    },
  },

  productCardContent: {
    minWidth: 0,
    flex: 1,
    p: {
      xs: 1.8,
      lg: 1.95,
    },
    pt: {
      xs: 1.55,
      lg: 1.7,
    },
    display: "flex",
    flexDirection: "column",

    "&:last-child": {
      pb: {
        xs: 1.8,
        lg: 1.95,
      },
    },
  },

  productName: {
    minWidth: 0,
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 15.5,
      lg: 16,
      xl: 16.25,
    },
    fontWeight: 700,
    letterSpacing: "-0.018em",
    lineHeight: 1.22,
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  productMetadata: {
    mt: 1.05,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 0.6,
  },

  productGeneticsChip: {
    height: 26,
    borderRadius: "8px",
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primary, 0.11),
    border: `1px solid ${alpha(colors.brand.primary, 0.09)}`,

    "& .MuiChip-label": {
      px: 1.05,
      fontSize: 11.5,
      fontWeight: 600,
    },
  },

  productThcChip: {
    height: 27,
    borderRadius: "8px",
    color: colors.text.secondary,
    backgroundColor: alpha(colors.text.primary, 0.04),
    border: `1px solid ${subtleBorder}`,

    "& .MuiChip-label": {
      px: 1.05,
      fontSize: 11.5,
      fontWeight: 550,
    },
  },

  productDescription: {
    mt: 1.15,
    height: 44,
    minHeight: 44,
    maxHeight: 44,
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: "22px",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    overflowWrap: "anywhere",
  },

  productDivider: {
    mt: "auto",
    mb: 1.2,
    pt: 1.35,
    borderBottom: `1px solid ${subtleDivider}`,
  },

  productPrice: {
    color: colors.text.primary,
    fontSize: 17.5,
    fontWeight: 700,
    letterSpacing: "-0.015em",
    lineHeight: 1.2,
  },

  productAvailability: {
    mt: 0.45,
    color: colors.brand.primary,
    fontSize: 12.25,
    fontWeight: 500,
    lineHeight: 1.35,
  },

  productAvailabilityLow: {
    color: colors.state.warning,
  },

  productCardAction: {
    mt: 1.25,
  },

  addProductButton: {
    width: "100%",
    minHeight: 45,
    borderRadius: "11px",
    color: colors.brand.primaryDark,
    borderColor: alpha(colors.brand.primary, 0.36),
    backgroundColor: pageBackground,
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 600,
    boxShadow: "none",

    "& .MuiButton-startIcon": {
      width: 22,
      height: 22,
      mr: 0.85,
      display: "grid",
      placeItems: "center",
      borderRadius: "50%",
      border: `1.5px solid ${colors.brand.primary}`,
    },

    "& .MuiButton-startIcon svg": {
      fontSize: 15,
    },

    "&:hover": {
      borderColor: colors.brand.primary,
      backgroundColor: alpha(colors.brand.primary, 0.05),
      boxShadow: `0 0 0 3px ${alpha(colors.brand.primary, 0.06)}`,
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.brand.primary, 0.2)}`,
      outlineOffset: 2,
    },

    "&.Mui-disabled": {
      color: colors.text.muted,
      borderColor: colors.border.default,
      backgroundColor: mutedSurface,
    },
  },

  quantityControl: {
    width: "100%",
    minHeight: 50,
    px: 0.45,
    display: "grid",
    gridTemplateColumns: "44px minmax(0, 1fr) 44px",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: "12px",
    backgroundColor: pageBackground,
    border: `1px solid ${alpha(colors.brand.primary, 0.28)}`,
    boxShadow: `inset 0 0 0 1px ${alpha(colors.brand.primary, 0.025)}`,
  },

  quantityButton: {
    width: 38,
    height: 38,
    justifySelf: "center",
    borderRadius: "50%",
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primary, 0.055),

    "&:hover": {
      backgroundColor: alpha(colors.brand.primary, 0.1),
    },

    "&.Mui-disabled": {
      color: colors.text.muted,
      backgroundColor: mutedSurface,
    },

    "& svg": {
      fontSize: 20,
    },
  },

  quantityValue: {
    minWidth: 0,
    px: 1,
    textAlign: "center",
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    lineHeight: 1,
    whiteSpace: "nowrap",
  },

  /* =========================================================
     PANEL PREMIUM TU RESERVA
  ========================================================= */

  draftCard: {
    minWidth: 0,
    maxHeight: "calc(100vh - 112px)",
    overflowY: "auto",
    overscrollBehavior: "contain",
    borderRadius: "19px",
    backgroundColor: pageBackground,
    border: `1px solid ${subtleBorder}`,
    boxShadow: reservationPanelShadow,

    "&::-webkit-scrollbar": {
      width: 8,
    },

    "&::-webkit-scrollbar-thumb": {
      borderRadius: "999px",
      backgroundColor: alpha(colors.text.primary, 0.14),
      border: `2px solid ${pageBackground}`,
    },
  },

  draftHeader: {
    px: {
      xs: 2.25,
      sm: 2.5,
    },
    pt: {
      xs: 2.25,
      sm: 2.5,
    },
    pb: 1.4,
  },

  draftTitle: {
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 22,
      sm: 24,
    },
    fontWeight: 800,
    letterSpacing: "-0.04em",
    lineHeight: 1.1,
  },

  draftSubtitle: {
    mt: 0.75,
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: 450,
    lineHeight: 1.5,
  },

  draftBody: {
    px: {
      xs: 2.25,
      sm: 2.5,
    },
    pb: {
      xs: 2.25,
      sm: 2.5,
    },
    pt: 1.25,
    display: "flex",
    flexDirection: "column",
    gap: 1.75,
  },

  draftItemsList: {
    display: "grid",
    gap: 1.25,
  },

  draftItem: {
    minWidth: 0,
    p: 1.35,
    borderRadius: "14px",
    backgroundColor: pageBackground,
    border: `1px solid ${subtleBorder}`,
    boxShadow: "0 7px 18px rgba(15, 39, 27, 0.025)",
  },

  draftItemHeader: {
    minWidth: 0,
    display: "grid",
    gridTemplateColumns: "62px minmax(0, 1fr) 34px",
    alignItems: "start",
    gap: 1.15,
  },

  draftItemImage: {
    width: 62,
    height: 62,
    display: "block",
    flexShrink: 0,
    objectFit: "cover",
    borderRadius: "11px",
    backgroundColor: mutedSurface,
    border: `1px solid ${subtleBorder}`,
  },

  draftItemImageFallback: {
    width: 62,
    height: 62,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    borderRadius: "11px",
    color: colors.brand.primary,
    backgroundColor: mutedSurface,
    border: `1px solid ${subtleBorder}`,

    "& svg": {
      fontSize: 24,
    },
  },

  draftItemCopy: {
    minWidth: 0,
    pt: 0.15,
  },

  draftItemName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: colors.brand.primaryDark,
    fontSize: 15.25,
    fontWeight: 800,
    lineHeight: 1.25,
  },

  draftItemPrice: {
    mt: 0.45,
    color: colors.text.secondary,
    fontSize: 12.5,
    fontWeight: 550,
    lineHeight: 1.35,
  },

  removeDraftItemButton: {
    width: 34,
    height: 34,
    color: colors.brand.primaryDark,

    "&:hover": {
      color: colors.state.error,
      backgroundColor: errorSurface,
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.state.error, 0.16)}`,
      outlineOffset: 1,
    },

    "& svg": {
      fontSize: 18,
    },
  },

  draftItemFooter: {
    mt: 1.15,
    pl: {
      xs: 0,
      sm: "73px",
    },
    display: "grid",
    gridTemplateColumns: "minmax(150px, 1fr) auto",
    alignItems: "center",
    gap: 1.15,
  },

  draftItemQuantityControl: {
    minHeight: 40,
    display: "grid",
    gridTemplateColumns: "40px minmax(0, 1fr) 40px",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: "10px",
    backgroundColor: softSurface,
    border: `1px solid ${subtleBorder}`,
  },

  draftItemQuantityButton: {
    width: 40,
    height: 38,
    borderRadius: 0,
    color: colors.brand.primaryDark,
    backgroundColor: alpha(colors.brand.primary, 0.035),

    "&:hover": {
      backgroundColor: alpha(colors.brand.primary, 0.085),
    },

    "&.Mui-disabled": {
      color: colors.text.muted,
    },

    "& svg": {
      fontSize: 18,
    },
  },

  draftItemQuantityValue: {
    minWidth: 0,
    textAlign: "center",
    color: colors.text.primary,
    fontSize: 13.75,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  draftItemSubtotal: {
    minWidth: 72,
    textAlign: "right",
    color: colors.text.primary,
    fontSize: 15.5,
    fontWeight: 800,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  },

  draftSummaryCard: {
    overflow: "hidden",
    borderRadius: "14px",
    backgroundColor: pageBackground,
    border: `1px solid ${subtleBorder}`,
  },

  draftSummaryRows: {
    px: 1.55,
    py: 0.75,

    "& > * + *": {
      borderTop: `1px solid ${subtleDivider}`,
    },
  },

  draftSummaryRow: {
    minWidth: 0,
    minHeight: 49,
    display: "grid",
    gridTemplateColumns: "32px minmax(0, 1fr) auto",
    alignItems: "center",
    gap: 1,
  },

  draftSummaryIcon: {
    width: 32,
    height: 32,
    display: "grid",
    placeItems: "center",
    color: colors.text.secondary,

    "& svg": {
      fontSize: 19,
    },
  },

  draftSummaryLabel: {
    minWidth: 0,
    color: colors.text.secondary,
    fontSize: 12.5,
    fontWeight: 550,
    lineHeight: 1.4,
  },

  draftSummaryValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.2,
    textAlign: "right",
    whiteSpace: "nowrap",
  },

  draftEstimatedTotalValue: {
    color: colors.brand.primary,
    fontSize: 17,
    fontWeight: 800,
  },

  draftLimitValue: (exceedsLimit: boolean) => ({
    color: exceedsLimit ? colors.state.error : colors.text.primary,
    fontWeight: 800,
  }),

  legalLimitNotice: {
    mx: 1.55,
    mb: 1.55,
    p: 1.2,
    display: "flex",
    alignItems: "flex-start",
    gap: 0.9,
    borderRadius: "11px",
    color: colors.brand.primaryDark,
    backgroundColor: successSurface,
    border: `1px solid ${successBorder}`,

    "& svg": {
      mt: 0.05,
      flexShrink: 0,
      fontSize: 19,
      color: colors.brand.primary,
    },
  },

  legalLimitNoticeText: {
    color: "inherit",
    fontSize: 11.5,
    fontWeight: 550,
    lineHeight: 1.5,
  },

  observationsFieldWrapper: {
    display: "grid",
    gap: 0.75,
  },

  observationsLabel: {
    color: colors.brand.primaryDark,
    fontSize: 13,
    fontWeight: 750,
    lineHeight: 1.3,
  },

  observationsField: {
    width: "100%",

    "& .MuiOutlinedInput-root": {
      minHeight: 132,
      alignItems: "flex-start",
      borderRadius: "13px",
      color: colors.text.primary,
      backgroundColor: pageBackground,
      fontSize: 13,
      transition: "border-color 160ms ease, box-shadow 160ms ease",
    },

    "& .MuiInputBase-inputMultiline": {
      lineHeight: 1.55,
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: subtleBorder,
    },

    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.border.strong,
    },

    "& .MuiOutlinedInput-root.Mui-focused": {
      boxShadow: `0 0 0 3px ${alpha(colors.brand.primary, 0.09)}`,
    },

    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.brand.primary,
      borderWidth: 1.5,
    },

    "& .MuiInputBase-input::placeholder": {
      color: colors.text.muted,
      opacity: 1,
    },
  },

  observationsCounter: {
    mt: -3.6,
    mr: 1.4,
    mb: 1.2,
    position: "relative",
    zIndex: 1,
    justifySelf: "end",
    color: colors.text.secondary,
    fontSize: 11.5,
    fontWeight: 550,
    lineHeight: 1,
    pointerEvents: "none",
  },

  draftValidationNotice: {
    p: 1.2,
    display: "flex",
    alignItems: "flex-start",
    gap: 0.85,
    borderRadius: "11px",
    color: colors.state.warning,
    backgroundColor: warningSurface,
    border: `1px solid ${warningBorder}`,

    "& svg": {
      mt: 0.05,
      flexShrink: 0,
      fontSize: 18,
    },
  },

  draftValidationErrorNotice: {
    color: colors.state.error,
    backgroundColor: errorSurface,
    borderColor: errorBorder,
  },

  draftValidationText: {
    color: "inherit",
    fontSize: 11.75,
    fontWeight: 550,
    lineHeight: 1.5,
  },

  confirmReservationButton: {
    width: "100%",
    minHeight: 52,
    px: 2.5,
    borderRadius: "12px",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    textTransform: "none",
    fontSize: 14.5,
    fontWeight: 800,
    boxShadow: "0 11px 24px rgba(47, 111, 70, 0.2)",

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 14px 30px rgba(47, 111, 70, 0.24)",
    },

    "&:focus-visible": {
      outline: `3px solid ${alpha(colors.brand.primary, 0.28)}`,
      outlineOffset: 2,
    },

    "&.Mui-disabled": {
      color: alpha(colors.text.inverse, 0.76),
      backgroundColor: alpha(colors.brand.primary, 0.48),
      boxShadow: "none",
    },
  },

  confirmReservationSpinner: {
    color: "inherit",
  },

  reservationValidationFootnote: {
    px: 0.25,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 0.9,
    color: colors.text.secondary,

    "& svg": {
      mt: 0.05,
      flexShrink: 0,
      fontSize: 19,
      color: colors.brand.primary,
    },
  },

  reservationValidationFootnoteText: {
    color: "inherit",
    fontSize: 11.5,
    fontWeight: 550,
    lineHeight: 1.5,
  },

  emptyDraftState: {
    minHeight: 290,
    px: 2.5,
    py: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: "14px",
    backgroundColor: softSurface,
    border: `1px dashed ${colors.border.strong}`,
  },

  emptyDraftIcon: {
    width: 56,
    height: 56,
    mb: 1.6,
    display: "grid",
    placeItems: "center",
    borderRadius: "16px",
    color: colors.brand.primary,
    backgroundColor: colors.brand.primaryLight,

    "& svg": {
      fontSize: 30,
    },
  },

  emptyDraftTitle: {
    color: colors.brand.primaryDark,
    fontSize: 16.5,
    fontWeight: 800,
    letterSpacing: "-0.025em",
    lineHeight: 1.25,
  },

  emptyDraftDescription: {
    maxWidth: 275,
    mt: 0.8,
    color: colors.text.secondary,
    fontSize: 12.5,
    fontWeight: 450,
    lineHeight: 1.55,
  },

  /* =========================================================
     EXPERIENCIA MÓVIL
  ========================================================= */

  mobileDraftBarSpacer: {
    display: {
      xs: "block",
      lg: "none",
    },
    height: 92,
  },

  mobileDraftBar: {
    display: {
      xs: "flex",
      lg: "none",
    },
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: (theme: Theme) => theme.zIndex.appBar + 1,
    minHeight: 80,
    px: {
      xs: 1.75,
      sm: 2.25,
    },
    py: 1.2,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.25,
    backgroundColor: alpha(pageBackground, 0.97),
    borderTop: `1px solid ${subtleBorder}`,
    boxShadow: "0 -12px 30px rgba(15, 39, 27, 0.1)",
    backdropFilter: "blur(14px)",
  },

  mobileDraftBarSummary: {
    minWidth: 0,
  },

  mobileDraftBarPrimary: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.25,
  },

  mobileDraftBarSecondary: {
    mt: 0.35,
    color: colors.text.secondary,
    fontSize: 11.25,
    fontWeight: 550,
    lineHeight: 1.25,
  },

  mobileDraftReviewButton: {
    minHeight: 44,
    px: 1.9,
    flexShrink: 0,
    borderRadius: "11px",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    textTransform: "none",
    fontSize: 12.75,
    fontWeight: 800,
    boxShadow: "none",

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
    },
  },

  mobileDraftDrawerPaper: {
    maxHeight: "92vh",
    overflow: "hidden",
    borderTopLeftRadius: "22px",
    borderTopRightRadius: "22px",
    backgroundColor: pageBackground,
  },

  mobileDraftDrawerContent: {
    maxHeight: "92vh",
    overflowY: "auto",
  },

  mobileDrawerHandleWrapper: {
    py: 1.1,
    display: "flex",
    justifyContent: "center",
  },

  mobileDrawerHandle: {
    width: 44,
    height: 4,
    borderRadius: "999px",
    backgroundColor: colors.border.strong,
  },

  /* =========================================================
     RESULTADO DE LA RESERVA
  ========================================================= */

  resultDialogPaper: {
    width: "100%",
    maxWidth: 540,
    overflow: "hidden",
    borderRadius: "20px",
    backgroundColor: pageBackground,
    border: `1px solid ${subtleBorder}`,
    boxShadow: "0 30px 86px rgba(15, 39, 27, 0.22)",
  },

  resultContent: {
    px: {
      xs: 2.25,
      sm: 3.25,
    },
    pt: {
      xs: 2.75,
      sm: 3.25,
    },
    pb: 1.6,
    textAlign: "center",
  },

  resultIcon: (tone: "success" | "warning" | "info" | "error") => {
    const toneStyles = {
      success: {
        color: colors.state.success,
        backgroundColor: successSurface,
        borderColor: successBorder,
      },
      warning: {
        color: colors.state.warning,
        backgroundColor: warningSurface,
        borderColor: warningBorder,
      },
      info: {
        color: colors.brand.primary,
        backgroundColor: alpha(colors.brand.primary, 0.085),
        borderColor: alpha(colors.brand.primary, 0.18),
      },
      error: {
        color: colors.state.error,
        backgroundColor: errorSurface,
        borderColor: errorBorder,
      },
    } as const;

    const selectedTone = toneStyles[tone];

    return {
      width: 64,
      height: 64,
      mx: "auto",
      mb: 2,
      display: "grid",
      placeItems: "center",
      borderRadius: "18px",
      color: selectedTone.color,
      backgroundColor: selectedTone.backgroundColor,
      border: `1px solid ${selectedTone.borderColor}`,

      "& svg": {
        fontSize: 35,
      },
    };
  },

  resultTitle: {
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 22,
      sm: 24,
    },
    fontWeight: 800,
    letterSpacing: "-0.04em",
    lineHeight: 1.15,
  },

  resultMessage: {
    maxWidth: 440,
    mx: "auto",
    mt: 1,
    color: colors.text.secondary,
    fontSize: 13.5,
    fontWeight: 450,
    lineHeight: 1.6,
  },

  resultSummary: {
    mt: 2.35,
    overflow: "hidden",
    textAlign: "left",
    borderRadius: "14px",
    backgroundColor: softSurface,
    border: `1px solid ${subtleBorder}`,

    "& > * + *": {
      borderTop: `1px solid ${subtleDivider}`,
    },
  },

  resultSummaryRow: {
    minHeight: 47,
    px: 1.6,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "center",
    gap: 1.25,
  },

  resultSummaryLabel: {
    color: colors.text.secondary,
    fontSize: 12.25,
    fontWeight: 550,
  },

  resultSummaryValue: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: 800,
    textAlign: "right",
  },

  resultActions: {
    px: {
      xs: 2.25,
      sm: 3.25,
    },
    pt: 1,
    pb: {
      xs: 2.4,
      sm: 2.85,
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: {
      xs: "column-reverse",
      sm: "row",
    },
    gap: 1,
  },

  resultSecondaryButton: {
    width: {
      xs: "100%",
      sm: "auto",
    },
    minHeight: 44,
    px: 2.35,
    borderRadius: "11px",
    color: colors.text.primary,
    borderColor: colors.border.default,
    textTransform: "none",
    fontSize: 13,
    fontWeight: 750,

    "&:hover": {
      borderColor: alpha(colors.brand.primary, 0.35),
      backgroundColor: alpha(colors.brand.primary, 0.045),
    },
  },

  resultPrimaryButton: {
    width: {
      xs: "100%",
      sm: "auto",
    },
    minHeight: 44,
    px: 2.5,
    borderRadius: "11px",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    textTransform: "none",
    fontSize: 13,
    fontWeight: 800,
    boxShadow: "0 10px 22px rgba(47, 111, 70, 0.18)",

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 12px 26px rgba(47, 111, 70, 0.24)",
    },
  },

  /* =========================================================
     ESTADOS DEL CATÁLOGO
  ========================================================= */

  catalogStateCard: {
    minHeight: 390,
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
    backgroundColor: pageBackground,
    border: `1px solid ${subtleBorder}`,
    boxShadow: productCardShadow,
  },

  catalogStateIcon: {
    width: 60,
    height: 60,
    mb: 2,
    display: "grid",
    placeItems: "center",
    borderRadius: "17px",
    color: colors.brand.primary,
    backgroundColor: colors.brand.primaryLight,
    border: `1px solid ${alpha(colors.brand.primary, 0.12)}`,

    "& svg": {
      fontSize: 32,
    },
  },

  catalogErrorIcon: {
    color: colors.state.error,
    backgroundColor: errorSurface,
    borderColor: errorBorder,
  },

  catalogStateTitle: {
    color: colors.brand.primaryDark,
    fontSize: {
      xs: 20,
      sm: 22,
    },
    fontWeight: 800,
    letterSpacing: "-0.035em",
    lineHeight: 1.2,
  },

  catalogStateDescription: {
    maxWidth: 480,
    mt: 0.95,
    color: colors.text.secondary,
    fontSize: 13.25,
    fontWeight: 450,
    lineHeight: 1.6,
  },

  retryButton: {
    mt: 2.1,
    minHeight: 44,
    px: 2.5,
    borderRadius: "11px",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    textTransform: "none",
    fontSize: 13,
    fontWeight: 800,
    boxShadow: "none",

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 9px 22px rgba(47, 111, 70, 0.18)",
    },
  },

  /* =========================================================
     SKELETONS
  ========================================================= */

  skeletonGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(2, minmax(0, 1fr))",
      md: "repeat(3, minmax(0, 1fr))",
      lg: "repeat(3, minmax(0, 1fr))",
      xl: "repeat(3, minmax(0, 1fr))",
    },
    gap: {
      xs: 1.75,
      sm: 2,
      md: 2.25,
    },
  },

  skeletonProductCard: {
    minHeight: 430,
    overflow: "hidden",
    borderRadius: "17px",
    backgroundColor: pageBackground,
    border: `1px solid ${subtleBorder}`,
    boxShadow: productCardShadow,
  },

  skeletonProductImage: {
    width: "auto",
    height: {
      xs: 224,
      sm: 184,
      md: 172,
      xl: 178,
    },
    mx: {
      xs: 1.4,
      md: 1.55,
    },
    mt: {
      xs: 1.4,
      md: 1.55,
    },
    borderRadius: "12px",
  },

  skeletonProductBody: {
    p: {
      xs: 1.55,
      md: 1.7,
    },
  },

  skeletonDraftCard: {
    minHeight: 620,
    borderRadius: "19px",
    backgroundColor: pageBackground,
    border: `1px solid ${subtleBorder}`,
    boxShadow: reservationPanelShadow,
  },
} as const;
