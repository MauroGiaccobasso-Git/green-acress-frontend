import { colors } from "@/theme/colors";

/*
Estilos específicos del ConsentContainer.

Responsabilidades:

- mantener la identidad visual del dominio auth;
- reutilizar los tokens globales del Design System;
- centralizar los estilos del flujo de consentimiento;
- mantener el container enfocado en estructura y lógica;
- garantizar una experiencia mobile first.
*/

const consentContentStyles = {
  p: 2.5,
  borderRadius: "22px",
  backgroundColor: colors.background.soft,
  border: `1px solid ${colors.border.default}`,
} as const;


const legalContentStyles = {
  p: {
    xs: 2,
    sm: 2.5,
  },
  borderRadius: "24px",
  backgroundColor: "rgba(255,255,255,0.76)",
  border: `1px solid ${colors.border.default}`,
} as const;


export const consentStyles = {

  page: {
    minHeight: "100vh",
    backgroundImage:
      "linear-gradient(90deg, rgba(7,24,16,0.42) 0%, rgba(18,51,34,0.18) 42%, rgba(244,248,242,0.08) 100%), url('/images/login-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: {
      xs: 2,
      md: 4,
    },
    py: {
      xs: 4,
      md: 6,
    },
  },


  container: {
    width: "100%",
    maxWidth: 620,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2.5,
  },


  brandWrapper: {
    alignItems: "center",
    textAlign: "center",
  },


  brandIcon: {
    width: 46,
    height: 46,
    borderRadius: "16px",
    backgroundColor: colors.brand.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.inverse,
    fontWeight: 900,
    fontSize: 22,
    boxShadow: "0 12px 28px rgba(18,51,34,0.28)",
  },


  brandTitle: {
    color: colors.text.primary,
    letterSpacing: "-0.05em",
    lineHeight: 1,
  },


  brandSubtitle: {
    mt: 0.8,
    color: colors.text.inverse,
    fontWeight: 600,
    textShadow: "0 2px 12px rgba(0,0,0,0.35)",
  },


  card: {
    width: "100%",
    p: {
      xs: 2.5,
      sm: 3.5,
    },
    borderRadius: "38px",
    backgroundColor: "rgba(255,255,255,0.90)",
    backdropFilter: "blur(22px)",
    border: `1px solid ${colors.border.default}`,
    boxShadow:
      "0 32px 80px rgba(7,24,16,0.32), inset 0 1px 0 rgba(255,255,255,0.72)",
  },


  cardTitle: {
    color: colors.text.primary,
    letterSpacing: "-0.04em",
    lineHeight: 1.1,
  },


  cardSubtitle: {
    mt: 0.8,
    color: colors.text.secondary,
    fontWeight: 500,
    lineHeight: 1.5,
    maxWidth: 520,
  },


  consentBox: consentContentStyles,


  consentTitle: {
    color: colors.text.primary,
    fontWeight: 800,
  },


  consentDescription: {
    mt: 0.8,
    color: colors.text.secondary,
    lineHeight: 1.55,
  },


  legalBox: legalContentStyles,


  legalTitle: {
    color: colors.text.primary,
    fontWeight: 900,
    mb: 1,
  },


  legalIntroduction: {
    color: colors.text.secondary,
    lineHeight: 1.55,
    mb: 1,
  },


  legalList: {
    display: "flex",
    flexDirection: "column",
  },


  legalItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 1.2,
    py: 1.3,

    "&:not(:last-child)": {
      borderBottom: `1px solid ${colors.border.default}`,
    },
  },


  legalItemIcon: {
    color: colors.brand.primary,
    fontSize: 21,
    mt: 0.15,
    flexShrink: 0,
  },


  legalItemText: {
    color: colors.text.secondary,
    fontWeight: 500,
    lineHeight: 1.45,
    fontSize: 14,
  },


  checkboxContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    gap: 1,
    mt: 0.5,
    p: 1.8,
    borderRadius: "18px",
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },


  checkboxLabel: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.5,
    cursor: "pointer",
  },


  errorAlert: {
    borderRadius: "16px",
    fontWeight: 600,
  },


  successAlert: {
    borderRadius: "16px",
    fontWeight: 600,
  },


  submitButton: {
    mt: 0.5,
    minHeight: 52,
    borderRadius: "16px",
    backgroundColor: colors.brand.primary,
    color: colors.text.inverse,
    fontWeight: 900,
    boxShadow: "0 14px 28px rgba(47,111,70,0.28)",

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 16px 34px rgba(47,111,70,0.34)",
    },

    "&.Mui-disabled": {
      color: colors.text.inverse,
      backgroundColor: colors.state.disabled,
      boxShadow: "none",
      opacity: 0.78,
    },
  },


  backToLoginLink: {
    alignSelf: "center",
    fontSize: 14,
    fontWeight: 800,
    color: colors.text.secondary,
    transition: "color 160ms ease",

    "&:hover": {
      color: colors.brand.primary,
    },
  },

} as const;