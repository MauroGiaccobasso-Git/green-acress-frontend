import { colors } from "@/theme/colors";

/*
Estilos específicos del LoginContainer.

Responsabilidades:
- centralizar configuración visual del login;
- reutilizar identidad visual del sistema;
- mantener LoginContainer enfocado en estructura y lógica.
*/

/*
Estilos reutilizables para los campos
del formulario de autenticación.

Se centralizan para evitar duplicar
la misma configuración visual en email
y contraseña.
*/
const inputStyles = {
  "& .MuiOutlinedInput-root": {
    minHeight: 52,
    borderRadius: "16px",
    bgcolor: "rgba(247, 250, 247, 0.94)",
    fontWeight: 600,
    transition: "0.2s ease",

    "& fieldset": {
      borderColor: "rgba(159, 181, 165, 0.72)",
    },

    "&:hover fieldset": {
      borderColor: colors.brand.primary,
    },

    "&.Mui-focused fieldset": {
      borderColor: colors.brand.primary,
      borderWidth: 2,
    },
  },
} as const;

export const loginStyles = {
  page: {
    minHeight: "100vh",
    backgroundImage:
      "linear-gradient(90deg, rgba(7, 24, 16, 0.42) 0%, rgba(18, 51, 34, 0.18) 42%, rgba(244, 248, 242, 0.08) 100%), url('/images/login-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: { xs: 2, md: 4 },
    py: { xs: 4, md: 6 },
  },

  container: {
    width: "100%",
    maxWidth: 430,
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
    bgcolor: colors.brand.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.text.inverse,
    fontWeight: 900,
    fontSize: 22,
    boxShadow: "0 12px 28px rgba(18, 51, 34, 0.28)",
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
    textShadow: "0 2px 12px rgba(0, 0, 0, 0.35)",
  },

  card: {
    width: "100%",
    p: { xs: 3, sm: 3.4 },
    borderRadius: "38px",
    bgcolor: "rgba(255, 255, 255, 0.86)",
    backdropFilter: "blur(22px)",
    border: "1px solid rgba(255, 255, 255, 0.72)",
    boxShadow:
      "0 32px 80px rgba(7, 24, 16, 0.32), inset 0 1px 0 rgba(255,255,255,0.72)",
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
  },

  fieldLabel: {
    color: colors.text.primary,
    fontWeight: 800,
  },

  input: inputStyles,

  errorAlert: {
    borderRadius: "16px",
    fontWeight: 600,
  },

  submitButton: {
    mt: 0.5,
    minHeight: 50,
    borderRadius: "16px",
    bgcolor: colors.brand.primary,
    color: colors.text.inverse,
    fontWeight: 900,
    boxShadow: "0 14px 28px rgba(47, 111, 70, 0.28)",

    "&:hover": {
      bgcolor: colors.brand.primaryDark,
      boxShadow: "0 16px 34px rgba(47, 111, 70, 0.34)",
    },
  },

  forgotPasswordLink: {
    alignSelf: "center",
    fontSize: 14,
    fontWeight: 800,
    color: colors.text.secondary,
    transition: "0.2s ease",

    "&:hover": {
      color: colors.brand.primary,
    },
  },

  twoFactorBox: {
    mt: 0.5,
    p: 2,
    borderRadius: "22px",
    bgcolor: "rgba(238, 245, 239, 0.76)",
    border: "1px solid rgba(159, 181, 165, 0.42)",
  },

  twoFactorTitle: {
    color: colors.text.primary,
  },

  twoFactorDescription: {
    mt: 0.5,
    color: colors.text.secondary,
    lineHeight: 1.45,
  },
} as const;
