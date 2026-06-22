import { colors } from "@/theme/colors";

/*
Estilos del modal de alta rápida de proveedor.

Mantiene la misma línea visual utilizada
por CreateSeedModal para conservar una
experiencia consistente dentro del flujo
de Compras.
*/
export const createProviderModalStyles = {
  paper: {
    borderRadius: "18px",
    overflow: "hidden",
  },

  title: {
    px: { xs: 2.25, md: 3 },
    pt: { xs: 2.25, md: 3 },
    pb: 1.5,
  },

  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: "14px",
    display: "grid",
    placeItems: "center",
    color: colors.brand.primary,
    bgcolor: colors.brand.primaryLight,
    flexShrink: 0,
  },

  headerText: {
    minWidth: 0,
  },

  heading: {
    color: colors.text.primary,
    fontSize: { xs: 21, md: 24 },
    fontWeight: 900,
    letterSpacing: "-0.045em",
    lineHeight: 1.08,
  },

  subtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: 450,
    lineHeight: 1.45,
    mt: 0.5,
  },

  content: {
    px: { xs: 2.25, md: 3 },
    pb: 3,
  },

  errorAlert: {
    mb: 2,
    borderRadius: "12px",
  },

  form: {
    display: "grid",
    gap: 1.6,
    mt: 1,
  },

  helperBox: {
    p: 1.5,
    borderRadius: "14px",
    bgcolor: colors.background.app,
    border: `1px solid ${colors.border.default}`,
  },

  helperText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1.5,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 1,
    mt: 1,
  },

  cancelButton: {
    minHeight: 46,
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 800,
  },

  submitButton: {
    minHeight: 46,
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 900,
    boxShadow: "none",
  },
} as const;