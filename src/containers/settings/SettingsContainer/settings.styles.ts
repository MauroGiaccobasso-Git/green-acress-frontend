import { colors } from "@/theme/colors";

/*
==================================================
ESTILOS DEL MÓDULO CONFIGURACIÓN
==================================================

Criterios aplicados:

- mobile first;
- consistencia visual con los módulos Gold;
- jerarquía clara de información;
- flujo MFA guiado paso a paso;
- tratamiento seguro de información sensible;
- estados visuales accesibles;
- responsive sin modificar layouts globales;
- uso centralizado de tokens del Design System.
*/

const panelShadow = "0 18px 40px rgba(15, 39, 27, 0.045)";
const cardShadow = "0 12px 28px rgba(15, 39, 27, 0.032)";

const subtleGreen = "#E8F5E9";
const subtleOrange = "#FFF4E5";

const green = "#2E7D32";
const orange = "#ED6C02";

export const settingsStyles = {
  /* =========================================================
     ESTRUCTURA GENERAL
  ========================================================= */

  root: {
    width: "100%",
  },

  pageContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 2.5,
  },

  /* =========================================================
     ENCABEZADO
  ========================================================= */

  pageHeader: {
    display: "flex",
    alignItems: "center",
    gap: 1.75,
  },

  pageHeaderIcon: {
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
    color: colors.brand.primary,
    backgroundColor: colors.brand.primaryLight,
    border: `1px solid ${colors.border.default}`,

    "& svg": {
      fontSize: {
        xs: 25,
        sm: 29,
      },
    },
  },

  pageHeaderContent: {
    minWidth: 0,
  },

  pageTitle: {
    fontSize: {
      xs: 24,
      sm: 28,
    },
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
    color: colors.text.primary,
  },

  pageDescription: {
    mt: 0.65,
    fontSize: {
      xs: 13.5,
      sm: 14,
    },
    fontWeight: 400,
    lineHeight: 1.45,
    color: colors.text.secondary,
  },

  feedbackAlert: {
    borderRadius: "13px",
    fontSize: 13.5,
    alignItems: "center",
  },

  /* =========================================================
     RESUMEN DE SEGURIDAD
  ========================================================= */

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "repeat(2, minmax(0, 1fr))",
    },
    gap: 1.75,
  },

  summaryCard: {
    minHeight: 126,
    p: {
      xs: 2,
      md: "22px 20px",
    },
    display: "flex",
    alignItems: "center",
    gap: 2,
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: cardShadow,
  },

  summaryIcon: {
    width: 54,
    height: 54,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "16px",
    color: colors.brand.primary,
    backgroundColor: colors.brand.primaryLight,

    "& svg": {
      fontSize: 30,
    },
  },

  summaryIconSuccess: {
    color: green,
    backgroundColor: subtleGreen,
  },

  summaryIconWarning: {
    color: orange,
    backgroundColor: subtleOrange,
  },

  summaryContent: {
    minWidth: 0,
  },

  summaryLabel: {
    fontSize: 12.5,
    fontWeight: 600,
    lineHeight: 1.25,
    color: colors.text.secondary,
  },

  summaryValue: {
    mt: 0.8,
    fontSize: {
      xs: 23,
      sm: 25,
    },
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "-0.035em",
    color: colors.text.primary,
  },

  summaryHint: {
    mt: 0.8,
    fontSize: 11.5,
    fontWeight: 400,
    lineHeight: 1.4,
    color: colors.text.muted,
  },

  /* =========================================================
     PANEL PRINCIPAL
  ========================================================= */

  panel: {
    overflow: "hidden",
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  panelHeader: {
    px: {
      xs: 2,
      sm: 2.5,
      md: 3,
    },
    py: {
      xs: 2,
      sm: 2.25,
    },
  },

  panelHeaderContent: {
    minWidth: 0,
  },

  panelTitle: {
    fontSize: {
      xs: 18,
      sm: 20,
    },
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: "-0.025em",
    color: colors.text.primary,
  },

  panelSubtitle: {
    mt: 0.65,
    maxWidth: 720,
    fontSize: 13.5,
    fontWeight: 400,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },

  panelBody: {
    p: {
      xs: 2,
      sm: 2.5,
      md: 3,
    },
  },

  /* =========================================================
     INFORMACIÓN DE CUENTA
  ========================================================= */

  accountSection: {
    display: "flex",
    flexDirection: "column",
    gap: 1.25,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.25,
    letterSpacing: "-0.01em",
    color: colors.text.primary,
  },

  accountCard: {
    p: {
      xs: 1.5,
      sm: 1.75,
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "44px minmax(0, 1fr)",
      sm: "48px minmax(0, 1fr) auto",
    },
    alignItems: "center",
    gap: {
      xs: 1.25,
      sm: 1.5,
    },
    borderRadius: "14px",
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  accountIcon: {
    width: {
      xs: 44,
      sm: 48,
    },
    height: {
      xs: 44,
      sm: 48,
    },
    display: "grid",
    placeItems: "center",
    borderRadius: "13px",
    color: colors.brand.primary,
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,

    "& svg": {
      fontSize: 23,
    },
  },

  accountInformation: {
    minWidth: 0,
  },

  accountEmail: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.3,
    color: colors.text.primary,
    overflowWrap: "anywhere",
  },

  accountMeta: {
    mt: 0.4,
    fontSize: 11.8,
    fontWeight: 500,
    lineHeight: 1.4,
    color: colors.text.secondary,
  },

  accountStatusChip: {
    gridColumn: {
      xs: "1 / -1",
      sm: "auto",
    },
    justifySelf: {
      xs: "start",
      sm: "end",
    },
    height: 25,
    borderRadius: "8px",
    fontSize: 10.8,
    fontWeight: 700,
    color: green,
    backgroundColor: subtleGreen,

    "& .MuiChip-label": {
      px: 1,
    },
  },

  sectionDivider: {
    my: {
      xs: 2.5,
      sm: 3,
    },
    borderColor: colors.border.default,
  },

  /* =========================================================
     MFA
  ========================================================= */

  mfaSection: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  mfaHeader: {
    display: "flex",
    alignItems: {
      xs: "stretch",
      md: "center",
    },
    justifyContent: "space-between",
    flexDirection: {
      xs: "column",
      md: "row",
    },
    gap: 2,
  },

  mfaHeaderIdentity: {
    minWidth: 0,
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
  },

  mfaIcon: {
    width: {
      xs: 44,
      sm: 48,
    },
    height: {
      xs: 44,
      sm: 48,
    },
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "14px",

    "& svg": {
      fontSize: {
        xs: 23,
        sm: 25,
      },
    },
  },

  mfaIconEnabled: {
    color: green,
    backgroundColor: subtleGreen,
  },

  mfaIconDisabled: {
    color: orange,
    backgroundColor: subtleOrange,
  },

  mfaHeaderContent: {
    minWidth: 0,
  },

  mfaTitleRow: {
    display: "flex",
    alignItems: {
      xs: "flex-start",
      sm: "center",
    },
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    gap: {
      xs: 0.75,
      sm: 1,
    },
  },

  mfaTitle: {
    fontSize: {
      xs: 15.5,
      sm: 16,
    },
    fontWeight: 800,
    lineHeight: 1.3,
    color: colors.text.primary,
  },

  mfaDescription: {
    mt: 0.75,
    maxWidth: 650,
    fontSize: 12.8,
    fontWeight: 400,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },

  mfaStatusChip: {
    height: 24,
    borderRadius: "7px",
    fontSize: 10.5,
    fontWeight: 700,

    "& .MuiChip-label": {
      px: 0.9,
    },
  },

  mfaStatusEnabled: {
    color: green,
    backgroundColor: subtleGreen,
  },

  mfaStatusDisabled: {
    color: orange,
    backgroundColor: subtleOrange,
  },

  /* =========================================================
     BOTONES
  ========================================================= */

  primaryButton: {
    minHeight: 44,
    px: 2.35,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 800,
    whiteSpace: "nowrap",
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    boxShadow: "0 10px 22px rgba(47, 111, 70, 0.2)",
    transition:
      "background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease, opacity 160ms ease",

    "& svg": {
      fontSize: 19,
    },

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 12px 26px rgba(47, 111, 70, 0.25)",
      transform: "translateY(-1px)",
    },

    "&:active": {
      transform: "translateY(0)",
    },

    "&.Mui-disabled": {
      color: colors.text.inverse,
      backgroundColor: colors.state.disabled,
      boxShadow: "none",
      opacity: 0.78,
    },
  },

  secondaryButton: {
    minHeight: 44,
    px: 2.25,
    borderRadius: "12px",
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 700,
    color: colors.text.secondary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,

    "&:hover": {
      color: colors.text.primary,
      borderColor: colors.border.strong,
      backgroundColor: colors.background.soft,
    },
  },

  textButton: {
    minWidth: "auto",
    px: 1,
    textTransform: "none",
    fontSize: 12.5,
    fontWeight: 700,
    color: colors.brand.primary,
  },

  /* =========================================================
     ESTADO MFA HABILITADO
  ========================================================= */

  enabledNotice: {
    p: {
      xs: 1.5,
      sm: 1.75,
    },
    display: "flex",
    alignItems: "flex-start",
    gap: 1.25,
    borderRadius: "14px",
    color: colors.text.primary,
    backgroundColor: subtleGreen,
    border: "1px solid rgba(46, 125, 50, 0.18)",
  },

  enabledNoticeIcon: {
    width: 38,
    height: 38,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "11px",
    color: green,
    backgroundColor: colors.background.surface,

    "& svg": {
      fontSize: 21,
    },
  },

  enabledNoticeTitle: {
    fontSize: 13.5,
    fontWeight: 800,
    lineHeight: 1.3,
    color: colors.text.primary,
  },

  enabledNoticeDescription: {
    mt: 0.45,
    fontSize: 12.2,
    fontWeight: 400,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },

  /* =========================================================
     FLUJO DE CONFIGURACIÓN
  ========================================================= */

  setupContainer: {
    overflow: "hidden",
    borderRadius: "16px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
  },

  setupIntroduction: {
    p: {
      xs: 1.75,
      sm: 2,
    },
    backgroundColor: colors.background.soft,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  setupTitle: {
    fontSize: {
      xs: 16,
      sm: 17,
    },
    fontWeight: 800,
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
    color: colors.text.primary,
  },

  setupDescription: {
    mt: 0.6,
    maxWidth: 720,
    fontSize: 12.8,
    fontWeight: 400,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },

  setupStep: {
    p: {
      xs: 1.75,
      sm: 2,
      md: 2.25,
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "38px minmax(0, 1fr)",
    },
    gap: {
      xs: 1.25,
      sm: 1.5,
    },
  },

  stepNumber: {
    width: 34,
    height: 34,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "11px",
    fontSize: 13,
    fontWeight: 800,
    color: colors.text.inverse,
    backgroundColor: colors.brand.primary,
    boxShadow: "0 7px 16px rgba(47, 111, 70, 0.18)",
  },

  stepContent: {
    minWidth: 0,
  },

  stepTitle: {
    fontSize: 14.5,
    fontWeight: 800,
    lineHeight: 1.3,
    color: colors.text.primary,
  },

  stepDescription: {
    mt: 0.55,
    maxWidth: 760,
    fontSize: 12.5,
    fontWeight: 400,
    lineHeight: 1.55,
    color: colors.text.secondary,
  },

  setupDivider: {
    mx: {
      xs: 1.75,
      sm: 2.25,
    },
    borderColor: colors.border.default,
  },

  /* =========================================================
     SECRETO MFA
  ========================================================= */

  secretCard: {
    mt: 1.75,
    p: {
      xs: 1.25,
      sm: 1.5,
    },
    display: "flex",
    alignItems: {
      xs: "stretch",
      sm: "center",
    },
    justifyContent: "space-between",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    gap: 1.25,
    borderRadius: "13px",
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  secretInformation: {
    minWidth: 0,
  },

  secretLabel: {
    fontSize: 10.8,
    fontWeight: 700,
    lineHeight: 1.2,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: colors.text.secondary,
  },

  secretValue: {
    display: "block",
    mt: 0.65,
    fontFamily:
      '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: {
      xs: 12.5,
      sm: 13.5,
    },
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: "0.06em",
    color: colors.text.primary,
    overflowWrap: "anywhere",
  },

  secretActions: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: {
      xs: "flex-end",
      sm: "center",
    },
    gap: 0.5,
  },

  copyButton: {
    width: 38,
    height: 38,
    borderRadius: "10px",
    color: colors.brand.primary,
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,

    "& svg": {
      fontSize: 18,
    },

    "&:hover": {
      backgroundColor: colors.brand.primaryLight,
      borderColor: colors.brand.primary,
    },
  },

  /* =========================================================
     CÓDIGOS DE RECUPERACIÓN
  ========================================================= */

  recoveryWarning: {
    mt: 1.5,
    borderRadius: "12px",
    fontSize: 12.3,
    lineHeight: 1.5,
  },

  recoveryCard: {
    mt: 1.5,
    overflow: "hidden",
    borderRadius: "14px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
  },

  recoveryHeader: {
    p: {
      xs: 1.35,
      sm: 1.5,
    },
    display: "flex",
    alignItems: {
      xs: "stretch",
      sm: "center",
    },
    justifyContent: "space-between",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    gap: 1.25,
    backgroundColor: colors.background.soft,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  recoveryTitle: {
    fontSize: 13.5,
    fontWeight: 800,
    lineHeight: 1.3,
    color: colors.text.primary,
  },

  recoverySubtitle: {
    mt: 0.35,
    fontSize: 11.3,
    fontWeight: 500,
    lineHeight: 1.4,
    color: colors.text.secondary,
  },

  copyCodesButton: {
    minHeight: 38,
    px: 1.75,
    borderRadius: "10px",
    textTransform: "none",
    fontSize: 12,
    fontWeight: 700,
    color: colors.brand.primary,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,

    "& svg": {
      fontSize: 17,
    },

    "&:hover": {
      borderColor: colors.brand.primary,
      backgroundColor: colors.brand.primaryLight,
    },
  },

  recoveryCodesGrid: {
    p: {
      xs: 1.25,
      sm: 1.5,
    },
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(4, minmax(0, 1fr))",
    },
    gap: 1,
  },

  recoveryCode: {
    minWidth: 0,
    px: 1.1,
    py: 1,
    display: "block",
    textAlign: "center",
    borderRadius: "10px",
    fontFamily:
      '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "0.04em",
    color: colors.text.primary,
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
    overflowWrap: "anywhere",
    userSelect: "all",
  },

  /* =========================================================
     CONFIRMACIÓN MFA
  ========================================================= */

  verificationForm: {
    mt: 1.75,
    maxWidth: 560,
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
  },

  codeField: {
    "& .MuiOutlinedInput-root": {
      minHeight: 52,
      borderRadius: "13px",
      backgroundColor: colors.background.surface,
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: "0.18em",
      color: colors.text.primary,
      transition:
        "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
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
      fontSize: 13,
      fontWeight: 500,
      color: colors.text.secondary,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.brand.primary,
    },

    "& input": {
      textAlign: "center",
    },

    "& input::placeholder": {
      color: colors.text.muted,
      opacity: 0.6,
    },
  },

  codeFieldIcon: {
    mr: 1,
    fontSize: 20,
    color: colors.brand.primary,
  },

  verificationActions: {
    display: "flex",
    alignItems: {
      xs: "stretch",
      sm: "center",
    },
    justifyContent: "flex-end",
    flexDirection: {
      xs: "column-reverse",
      sm: "row",
    },
    gap: 1,
  },

  /* =========================================================
     CONFIGURACIÓN COMPLETADA
  ========================================================= */

  completedState: {
    p: {
      xs: 1.75,
      sm: 2,
    },
    display: "flex",
    alignItems: "flex-start",
    gap: 1.35,
    borderRadius: "14px",
    backgroundColor: subtleGreen,
    border: "1px solid rgba(46, 125, 50, 0.18)",
  },

  completedIcon: {
    width: 42,
    height: 42,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: "12px",
    color: green,
    backgroundColor: colors.background.surface,

    "& svg": {
      fontSize: 24,
    },
  },

  completedContent: {
    minWidth: 0,
  },

  completedTitle: {
    fontSize: 14.5,
    fontWeight: 800,
    lineHeight: 1.3,
    color: colors.text.primary,
  },

  completedDescription: {
    mt: 0.45,
    fontSize: 12.5,
    fontWeight: 400,
    lineHeight: 1.5,
    color: colors.text.secondary,
  },

  completedReminder: {
    mt: 1,
    p: 1,
    borderRadius: "9px",
    fontSize: 11.8,
    fontWeight: 600,
    lineHeight: 1.45,
    color: colors.text.primary,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    border: "1px solid rgba(46, 125, 50, 0.14)",
  },

  /* =========================================================
     CARGA Y ESTADOS DEFENSIVOS
  ========================================================= */

  loadingState: {
    minHeight: 360,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 1.5,
    borderRadius: "18px",
    backgroundColor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: panelShadow,
  },

  loadingText: {
    fontSize: 13.5,
    fontWeight: 600,
    color: colors.text.secondary,
  },

  /* =========================================================
     AJUSTES RESPONSIVE Y ACCESIBILIDAD
  ========================================================= */

  "@media (prefers-reduced-motion: reduce)": {
    "& *": {
      transition: "none !important",
      animation: "none !important",
    },
  },

  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    p: 0,
    m: -1,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
};
