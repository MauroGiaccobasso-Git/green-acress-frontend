import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";

/*
Tema visual global del sistema.

Centraliza:
- paleta de colores;
- tipografía;
- estilos base de componentes Material UI.

Esto permite mantener consistencia visual
en todas las pantallas del frontend.
*/
export const theme = createTheme({
  palette: {
    primary: {
      main: colors.brand.primary,
      dark: colors.brand.primaryDark,
      light: colors.brand.primaryLight,
      contrastText: colors.text.inverse,
    },
    background: {
      default: colors.background.app,
      paper: colors.background.surface,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    error: {
      main: colors.state.error,
    },
    warning: {
      main: colors.state.warning,
    },
    success: {
      main: colors.state.success,
    },
  },

  typography: {
    fontFamily: '"Poppins", Arial, sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    h5: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },
    h6: {
      fontWeight: 800,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 999,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `1px solid ${colors.border.default}`,
        },
      },
    },
  },
});