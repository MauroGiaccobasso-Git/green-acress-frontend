import { colors } from "@/theme/colors";

/*
Estilos específicos del ChangePasswordContainer.

Responsabilidades:

- mantener la identidad visual del dominio de autenticación;
- reutilizar los tokens globales del Design System;
- centralizar los estilos de la pantalla;
- mantener el container enfocado en estructura y lógica;
- garantizar una experiencia mobile first.
*/

/*
Estilos reutilizables para los campos
de contraseña temporal, nueva contraseña
y confirmación.

Mantienen el mismo patrón visual
utilizado por LoginContainer,
ForgotPasswordContainer y
ResetPasswordContainer.
*/
const inputStyles = {
  "& .MuiOutlinedInput-root": {
    minHeight: 52,
    borderRadius: "16px",
    backgroundColor: colors.background.surface,
    fontWeight: 600,
    transition:
      "border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease",

    "& fieldset": {
      borderColor: colors.border.strong,
    },

    "&:hover fieldset": {
      borderColor: colors.brand.primary,
    },

    "&.Mui-focused": {
      boxShadow: `0 0 0 3px ${colors.background.soft}`,
    },

    "&.Mui-focused fieldset": {
      borderColor: colors.brand.primary,
      borderWidth: 2,
    },
  },

  "& .MuiInputBase-input::placeholder": {
    color: colors.text.muted,
    opacity: 1,
  },
} as const;

export const changePasswordStyles = {
  /*
  Contenedor principal de la página.

  Reutiliza la misma identidad visual
  del resto del dominio auth.
  */
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
    backgroundColor: colors.brand.primary,
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
    p: {
      xs: 3,
      sm: 3.4,
    },
    borderRadius: "38px",
    backgroundColor: "rgba(255, 255, 255, 0.88)",
    backdropFilter: "blur(22px)",
    border: `1px solid ${colors.border.default}`,
    boxShadow:
      "0 32px 80px rgba(7, 24, 16, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.72)",
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
  },

  fieldLabel: {
    color: colors.text.primary,
    fontWeight: 800,
  },

  input: inputStyles,

  /*
  Texto de ayuda sobre la política
  mínima de contraseña.
  */
  passwordHint: {
    mt: 0.35,
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 1.4,
  },

  /*
  Bloque informativo mostrado cuando
  el usuario debe reemplazar la
  contraseña temporal inicial.
  */
  temporaryPasswordNotice: {
    p: 2,
    borderRadius: "22px",
    backgroundColor: colors.background.soft,
    border: `1px solid ${colors.border.default}`,
  },

  temporaryPasswordTitle: {
    color: colors.text.primary,
    fontWeight: 800,
  },

  temporaryPasswordDescription: {
    mt: 0.5,
    color: colors.text.secondary,
    lineHeight: 1.45,
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
    minHeight: 50,
    borderRadius: "16px",
    backgroundColor: colors.brand.primary,
    color: colors.text.inverse,
    fontWeight: 900,
    boxShadow: "0 14px 28px rgba(47, 111, 70, 0.28)",

    "&:hover": {
      backgroundColor: colors.brand.primaryDark,
      boxShadow: "0 16px 34px rgba(47, 111, 70, 0.34)",
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