/*
Estilos del modal de compra registrada.

Se mantienen separados del componente para:
- evitar mezclar estructura JSX con decisiones visuales;
- facilitar mantenimiento;
- permitir reutilización futura del modal en otros flujos.
*/
export const purchaseSuccessModalStyles = {
  paper: {
    borderRadius: { xs: "24px", sm: "30px" },
    overflow: "hidden",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(248,252,249,0.99) 100%)",
    boxShadow:
      "0 34px 90px rgba(16, 42, 31, 0.26), 0 0 0 1px rgba(45, 125, 78, 0.08)",
  },

  content: {
    px: { xs: 2.4, sm: 4.2 },
    pt: { xs: 3.2, sm: 4.4 },
    pb: 2.4,
  },

  /*
  Bloque principal del modal.

  Prioriza feedback inmediato: el usuario debe entender
  en menos de un segundo que la operación fue exitosa.
  */
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 1.1,
    mb: 2.6,
  },

  iconWrapper: {
    width: { xs: 68, sm: 72 },
    height: { xs: 68, sm: 72 },
    borderRadius: "24px",
    display: "grid",
    placeItems: "center",
    background:
      "radial-gradient(circle at 50% 35%, rgba(45, 125, 78, 0.2) 0%, rgba(45, 125, 78, 0.08) 58%, rgba(45, 125, 78, 0.04) 100%)",
    border: "1px solid rgba(45, 125, 78, 0.18)",
    boxShadow:
      "0 20px 42px rgba(45, 125, 78, 0.16), inset 0 1px 0 rgba(255,255,255,0.75)",
  },

  heroIcon: {
    fontSize: { xs: 40, sm: 43 },
    color: "#2d7d4e",
  },

  title: {
    maxWidth: 520,
    fontSize: { xs: "1.38rem", sm: "1.58rem" },
    fontWeight: 950,
    color: "#102a1f",
    letterSpacing: "-0.045em",
    lineHeight: 1.08,
  },

  subtitle: {
    maxWidth: 420,
    fontSize: { xs: "0.9rem", sm: "0.94rem" },
    fontWeight: 600,
    color: "#62786c",
    lineHeight: 1.5,
  },

  /*
  Badge de identificación de compra.

  Refuerza trazabilidad mostrando el número o estado
  de la operación registrada.
  */
  purchaseBadge: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    p: { xs: 1.7, sm: 1.9 },
    mb: 1.7,
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, rgba(45, 125, 78, 0.1), rgba(45, 125, 78, 0.04))",
    border: "1px solid rgba(45, 125, 78, 0.15)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
  },

  badgeIcon: {
    fontSize: 30,
    color: "#2d7d4e",
  },

  badgeLabel: {
    fontSize: "0.68rem",
    fontWeight: 900,
    color: "#6d8175",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },

  badgeValue: {
    mt: 0.15,
    fontSize: "1rem",
    fontWeight: 950,
    color: "#102a1f",
    letterSpacing: "-0.02em",
  },

  /*
  Grilla de resumen operativo.

  En mobile pasa automáticamente a una sola columna
  para mantener legibilidad.
  */
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 1.2,
    mb: 1.7,
  },

  summaryItem: {
    p: { xs: 1.6, sm: 1.75 },
    borderRadius: "18px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(253,255,253,1) 100%)",
    border: "1px solid rgba(16, 42, 31, 0.075)",
    boxShadow: "0 12px 30px rgba(16, 42, 31, 0.055)",
  },

  summaryLabel: {
    mb: 0.45,
    fontSize: "0.68rem",
    fontWeight: 900,
    color: "#7a8d82",
    textTransform: "uppercase",
    letterSpacing: "0.09em",
  },

  summaryValue: {
    fontSize: { xs: "0.95rem", sm: "1rem" },

    /*
  900 mantiene presencia visual premium
  sin llegar al extremo de 950.
  */
    fontWeight: 900,

    color: "#102a1f",

    /*
  Se reduce la compresión entre caracteres.

  Antes:
  -0.025em

  Ahora:
  -0.01em

  Mejora la lectura de textos como:

  1 Semilla
  5 Unidades
  Proveedor Test Sprint 4

  sin perder el estilo visual premium.
  */
    letterSpacing: "-0.01em",

    lineHeight: 1.25,
  },

  /*
  Total registrado.

  Se destaca visualmente porque es el valor económico
  principal del registro interno de compra.
  */
  totalBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    p: { xs: 1.8, sm: 2 },
    mb: 1.8,
    borderRadius: "22px",
    background:
      "linear-gradient(135deg, rgba(45, 125, 78, 0.14), rgba(45, 125, 78, 0.055))",
    border: "1px solid rgba(45, 125, 78, 0.16)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
  },

  totalLabel: {
    fontSize: "0.72rem",
    fontWeight: 950,
    color: "#2d7d4e",
    textTransform: "uppercase",
    letterSpacing: "0.09em",
  },

  totalHint: {
    mt: 0.25,
    fontSize: "0.8rem",
    fontWeight: 650,
    color: "#63786c",
  },

  totalValue: {
    fontSize: { xs: "1.45rem", sm: "1.72rem" },
    fontWeight: 950,
    color: "#1f6f43",
    letterSpacing: "-0.045em",
    whiteSpace: "nowrap",
  },

  /*
  Bloque de trazabilidad.

  Explica qué efectos técnicos ocurrieron luego de confirmar:
  stock, movimiento de inventario y auditoría.
  */
  traceabilityBox: {
    display: "flex",
    flexDirection: "column",
    gap: 0.9,
    p: { xs: 1.65, sm: 1.85 },
    borderRadius: "20px",
    background:
      "linear-gradient(180deg, rgba(248,252,249,0.96), rgba(255,255,255,0.92))",
    border: "1px solid rgba(16, 42, 31, 0.075)",
    boxShadow: "0 10px 26px rgba(16, 42, 31, 0.045)",
  },

  traceabilityItem: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },

  checkIcon: {
    fontSize: 19,
    color: "#2d7d4e",
    flexShrink: 0,
  },

  traceabilityText: {
    fontSize: { xs: "0.84rem", sm: "0.88rem" },
    fontWeight: 800,
    color: "#385244",
    lineHeight: 1.35,
  },

  actions: {
    px: { xs: 2.4, sm: 4.2 },
    pb: { xs: 2.6, sm: 3.4 },
    pt: 0.5,
  },

  acceptButton: {
    width: "100%",
    py: 1.35,
    borderRadius: "16px",
    background: "linear-gradient(135deg, #1f6f43 0%, #247b4c 100%)",
    color: "#ffffff",
    fontWeight: 950,
    textTransform: "none",
    boxShadow: "0 18px 34px rgba(31, 111, 67, 0.24)",
    "&:hover": {
      background: "linear-gradient(135deg, #185936 0%, #206f44 100%)",
      boxShadow: "0 20px 38px rgba(31, 111, 67, 0.3)",
    },
  },
} as const;
