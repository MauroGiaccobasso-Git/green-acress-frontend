import { alpha, type Theme } from "@mui/material/styles";

import { colors } from "@/theme/colors";

/*
Estilos principales del módulo Compras.

Criterios:
- mantener el diseño mobile first;
- centralizar el layout y las secciones principales del container;
- dejar los estilos específicos de cada modal dentro de su propio módulo;
- evitar que PurchasesContainer mezcle definición visual con lógica;
- conservar coherencia visual con el módulo Ventas sin forzar una copia literal.
*/

export const purchasesStyles = {
  /*
  Estructura general de la pantalla.
  */
  page: {
    minHeight: "100%",
    mt: { xs: -1.5, md: -2.25 },
  },

  header: {
    mb: 4.2,
    px: { xs: 0, md: 0.5 },
  },

  headerContent: {
    maxWidth: 720,
  },

  title: {
    color: colors.text.primary,
    fontSize: { xs: 32, md: 38 },
    fontWeight: 850,
    letterSpacing: "-0.045em",
    lineHeight: 1.05,
    mb: 0.65,
  },

  subtitle: {
    maxWidth: 620,
    color: colors.text.secondary,
    fontSize: { xs: 14, md: 15 },
    fontWeight: 450,
    lineHeight: 1.45,
  },

  /*
  Métricas superiores del módulo.
  */
  headerStats: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(4, minmax(0, 1fr))",
    },
    gap: { xs: 1.5, md: 2 },
    width: "100%",
    maxWidth: 1480,
    mx: "auto",
    mb: 3,
  },

  statPill: {
    minHeight: { xs: 112, md: 126 },
    display: "flex",
    alignItems: "center",
    gap: { xs: 1.6, md: 2 },
    px: { xs: 2.1, md: 2.4 },
    py: { xs: 1.8, md: 2 },
    borderRadius: "13px",
    bgcolor: colors.background.surface,
    border: `1px solid ${alpha("#10291C", 0.06)}`,
    boxShadow: (theme: Theme) =>
      `0 14px 34px ${alpha(theme.palette.common.black, 0.065)}`,
    transition:
      "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",

    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: alpha("#2F6F46", 0.14),
      boxShadow: (theme: Theme) =>
        `0 20px 44px ${alpha(theme.palette.common.black, 0.08)}`,
    },

    "& svg": {
      width: { xs: 56, md: 64 },
      height: { xs: 56, md: 64 },
      p: { xs: 1.35, md: 1.55 },
      borderRadius: "13px",
      color: colors.brand.primary,
      bgcolor: alpha("#DDEEDC", 0.55),
      flexShrink: 0,
    },
  },

  statLabel: {
    color: colors.text.secondary,
    fontSize: { xs: 13, md: 14 },
    fontWeight: 650,
    lineHeight: 1.2,
    mb: 0.7,
    letterSpacing: "-0.018em",
  },

  statValue: {
    color: colors.text.primary,
    fontSize: { xs: 30, md: 33 },
    fontWeight: 850,
    letterSpacing: "-0.045em",
    lineHeight: 0.95,
  },

  providerMeta: {
    color: colors.text.secondary,
    fontSize: { xs: 12, md: 13 },
    fontWeight: 500,
    lineHeight: 1.35,
    mt: 0.75,
  },

  /*
  Estados globales de carga y feedback.
  */
  alert: {
    mb: 2,
    borderRadius: "12px",
  },

  loadingState: {
    minHeight: 280,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1.25,
    borderRadius: "12px",
    bgcolor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: (theme: Theme) =>
      `0 22px 58px ${alpha(theme.palette.common.black, 0.07)}`,
  },

  feedbackText: {
    maxWidth: 480,
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: 450,
    lineHeight: 1.55,
  },

  /*
  Layout principal: formulario operativo + resumen lateral.
  */
  contentGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      lg: "minmax(0, 1fr) 420px",
      xl: "minmax(0, 1fr) 440px",
    },
    gap: 2.5,
    alignItems: "start",
  },

  card: {
    overflow: "hidden",
    borderRadius: "12px",
    bgcolor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    boxShadow: (theme: Theme) =>
      `0 24px 64px ${alpha(theme.palette.common.black, 0.075)}`,

    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      bgcolor: colors.background.surface,

      "& fieldset": {
        borderColor: colors.border.default,
      },

      "&:hover fieldset": {
        borderColor: colors.brand.primaryLight,
      },

      "&.Mui-focused fieldset": {
        borderColor: colors.brand.primary,
        borderWidth: "1px",
      },
    },

    "& .MuiInputLabel-root": {
      color: colors.text.secondary,
      fontSize: 13,
      fontWeight: 500,
    },

    "& .MuiInputBase-input": {
      color: colors.text.primary,
      fontSize: 14,
      fontWeight: 500,
    },
  },

  summaryCard: {
    position: { lg: "sticky" },
    top: { lg: 24 },
    border: "none",
    boxShadow: (theme: Theme) =>
      `0 34px 90px ${alpha(theme.palette.common.black, 0.12)}`,
  },

  cardContent: {
    p: { xs: 2.25, md: 3 },
  },

  /*
  Encabezados reutilizados en las secciones del formulario.
  */
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
    mb: 2.35,
  },

  sectionTitle: {
    color: colors.text.primary,
    fontSize: { xs: 19, md: 22 },
    fontWeight: 900,
    letterSpacing: "-0.045em",
    lineHeight: 1.12,
  },

  sectionDescription: {
    maxWidth: 760,
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: 450,
    lineHeight: 1.45,
    mt: 0.35,
  },

  providerIcon: {
    width: 46,
    height: 46,
    borderRadius: "999px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    color: colors.text.inverse,
    bgcolor: colors.brand.primary,
    fontSize: 16,
    fontWeight: 900,
    boxShadow: (theme: Theme) =>
      `0 12px 28px ${alpha(theme.palette.primary.main, 0.24)}`,

    "& svg": {
      color: colors.brand.primary,
    },
  },

  /*
  Bloque de selección y resumen del proveedor.
  */
  providerPanel: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
    gap: 2,
    alignItems: "stretch",
  },

  providerCard: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
  },

  /*
Campo de observaciones administrativas
del bloque Datos de la compra.

Acompaña visualmente la altura de la
columna del proveedor para evitar
desbalance dentro del panel.
*/
  observationsInput: {
    flex: 1,

    "& .MuiInputBase-root": {
      height: "100%",
      alignItems: "flex-start",
    },

    "& .MuiInputBase-inputMultiline": {
      height: "100% !important",
      overflow: "auto !important",
    },
  },

  observationsColumn: {
    display: "flex",
    minWidth: 0,
  },

  selectedProviderBox: {
    minHeight: 108,
    display: "flex",
    alignItems: "center",
    gap: 1.35,
    p: 1.85,
    borderRadius: "12px",
    bgcolor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,

    "& > div:first-of-type": {
      width: 50,
      height: 50,
      borderRadius: "12px",
      color: colors.brand.primary,
      bgcolor: colors.brand.primaryLight,
      boxShadow: "none",
    },
  },

  providerName: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: "-0.025em",
    lineHeight: 1.2,
  },

  softChip: {
    height: 26,
    borderRadius: "999px",
    bgcolor: colors.background.surface,
    color: colors.text.secondary,
    border: `1px solid ${colors.border.default}`,
    fontSize: 11,
    fontWeight: 750,
  },

  /*
  Layout del bloque Agregar semillas.

  La columna del selector contiene también la acción de alta rápida,
  por lo que los controles laterales deben alinearse arriba y no al centro.
  Esto evita que Cantidad, Precio unitario y Agregar queden visualmente caídos.
  */
  addItemGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "minmax(360px, 1fr) 120px 150px 132px",
    },
    gap: { xs: 1.15, md: 1.35 },
    alignItems: "flex-start",

    "& > .MuiTextField-root": {
      alignSelf: "flex-start",
    },

    "& > .MuiButtonBase-root": {
      alignSelf: "flex-start",
    },
  },

  /*
  Encabezados de agrupación del selector de semillas.

  Las filas mantienen el mismo diseño del resto de los Select.
  El color se aplica únicamente a las cabeceras para comunicar
  el estado sin sobrecargar visualmente cada opción.
  */
  seedGroupHeader: {
    minHeight: 38,
    display: "flex",
    alignItems: "center",
    px: 2,
    py: 0.75,
    fontSize: 11,
    fontWeight: 850,
    letterSpacing: "0.055em",
    lineHeight: 1.2,
    textTransform: "uppercase",
    borderTop: `1px solid ${colors.border.default}`,
    borderBottom: `1px solid ${colors.border.default}`,
  },

  seedGroupHeaderActive: {
    color: colors.brand.primary,
    bgcolor: colors.brand.primaryLight,
  },

  seedGroupHeaderInactive: {
    color: (theme: Theme) => theme.palette.warning.dark,
    bgcolor: (theme: Theme) => alpha(theme.palette.warning.main, 0.12),
  },

  addItemButton: {
    minHeight: 52,
    px: 2.4,
    borderRadius: "12px",
    fontWeight: 850,
    textTransform: "none",
    whiteSpace: "nowrap",
    boxShadow: "none",
  },

  /*
  Vista previa de la semilla seleccionada.
  */
  seedPreview: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "94px 1fr" },
    gap: 1.5,
    alignItems: "center",
    mt: 2,
    p: 1.55,
    borderRadius: "12px",
    bgcolor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  seedImage: {
    width: { xs: "100%", sm: 94 },
    height: { xs: 190, sm: 94 },
    borderRadius: "12px",
    objectFit: "cover",
    bgcolor: colors.background.soft,
  },

  seedFallback: {
    width: { xs: "100%", sm: 94 },
    height: { xs: 190, sm: 94 },
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    bgcolor: colors.brand.primaryLight,
    color: colors.brand.primary,
    fontSize: 28,
    fontWeight: 900,
  },

  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 0.75,
    mt: 1.15,
  },

  detailProductName: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: "-0.02em",
  },

  detailProductMeta: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: 450,
    mt: 0.25,
  },

  /*
  Detalle de compra y estado vacío.
  */
  emptyState: {
    minHeight: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: 1.2,
    p: 4,
    borderRadius: "12px",
    bgcolor: colors.background.surface,
    border: `1px dashed ${colors.border.default}`,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: "999px",
    display: "grid",
    placeItems: "center",
    color: colors.brand.primary,
    bgcolor: colors.brand.primaryLight,
  },

  emptyTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: "-0.035em",
  },

  detailsList: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },

  detailItem: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "minmax(0, 1.45fr) 120px 120px 130px 42px",
    },
    gap: 1.25,
    alignItems: "center",
    p: 1.3,
    borderRadius: "12px",
    bgcolor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
    transition:
      "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",

    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: colors.brand.primaryLight,
      boxShadow: (theme: Theme) =>
        `0 18px 38px ${alpha(theme.palette.common.black, 0.07)}`,
    },
  },

  summaryLabel: {
    display: "flex",
    alignItems: "center",
    gap: 0.6,
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: 650,
  },

  detailValue: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: 750,
    letterSpacing: "-0.015em",
  },

  removeButton: {
    width: 40,
    height: 40,
    borderRadius: "12px",
    color: colors.state.error,
    justifySelf: { xs: "flex-start", md: "center" },

    "&:hover": {
      bgcolor: (theme: Theme) => alpha(theme.palette.error.main, 0.08),
    },
  },

  /*
  Resumen lateral de la compra.
  */
  summaryProviderCard: {
    minHeight: 86,
    display: "flex",
    alignItems: "center",
    gap: 1.35,
    p: 1.5,
    mb: 1.5,
    borderRadius: "14px",
    bgcolor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  summaryProviderIcon: {
    width: 48,
    height: 48,
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    color: "#2563EB",
    bgcolor: "#EAF1FF",
  },

  summaryTable: {
    display: "flex",
    flexDirection: "column",
    p: 1.5,
    mb: 1.5,
    borderRadius: "14px",
    bgcolor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
  },

  summaryRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    py: 1.05,

    "&:not(:last-of-type)": {
      borderBottom: `1px solid ${colors.border.default}`,
    },
  },

  summaryValue: {
    maxWidth: 200,
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: 850,
    textAlign: "right",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  totalRowLight: {
    minHeight: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    mt: 1.5,
    mb: 1.5,
    px: 1.65,
    py: 1.35,
    borderRadius: "14px",
    bgcolor: colors.brand.primaryLight,
    border: `1px solid ${alpha("#2F6F46", 0.16)}`,
  },

  totalLabelLight: {
    color: colors.brand.primary,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.035em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },

  totalValueLight: {
    color: colors.brand.primary,
    fontSize: { xs: 24, md: 26 },
    fontWeight: 900,
    letterSpacing: "-0.045em",
    lineHeight: 1,
    textAlign: "right",
    whiteSpace: "nowrap",
  },

  confirmationBox: {
    display: "flex",
    flexDirection: "column",
    gap: 0.75,
    p: 1.5,
    mb: 1.75,
    borderRadius: "14px",
    bgcolor: colors.background.surface,
    border: `1px solid ${colors.border.default}`,
  },

  confirmationHeader: {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    mb: 0.35,
  },

  confirmationIcon: {
    width: 28,
    height: 28,
    borderRadius: "999px",
    display: "grid",
    placeItems: "center",
    color: colors.brand.primary,
    bgcolor: colors.brand.primaryLight,
    flexShrink: 0,
  },

  confirmationTitle: {
    color: colors.brand.primary,
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: "-0.02em",
  },

  confirmationItem: {
    display: "flex",
    alignItems: "center",
    gap: 0.7,
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.45,

    "& svg": {
      width: 16,
      height: 16,
      color: colors.brand.primary,
      flexShrink: 0,
    },
  },

  /*
  Acciones principales del flujo.
  */
  submitButton: {
    width: "100%",
    minHeight: 54,
    mt: 0.5,
    borderRadius: "12px",
    fontWeight: 900,
    textTransform: "none",
    justifyContent: "space-between",
    px: 2,
    boxShadow: (theme: Theme) =>
      `0 18px 36px ${alpha(theme.palette.primary.main, 0.24)}`,

    "& .MuiButton-endIcon": {
      m: 0,
    },
  },

  secondaryButton: {
    width: "100%",
    minHeight: 48,
    mt: 1,
    borderRadius: "12px",
    fontWeight: 800,
    textTransform: "none",
    justifyContent: "space-between",
    px: 2,

    "& .MuiButton-endIcon": {
      m: 0,
    },
  },
} as const;