"use client";

import { ReactNode } from "react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { theme } from "@/theme/theme";

type ThemeProviderProps = {
  children: ReactNode;
};

/*
Provider encargado de aplicar
la configuración visual global
del sistema.

Responsabilidades:

- aplicar el tema de Material UI;
- centralizar colores y tipografías;
- establecer estilos base consistentes.

NO contiene lógica de negocio.

NO administra estado de la aplicación.
*/
export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      {/*
      Normaliza estilos entre navegadores
      y aplica configuraciones base de MUI.
      */}
      <CssBaseline />

      {children}
    </MuiThemeProvider>
  );
}
