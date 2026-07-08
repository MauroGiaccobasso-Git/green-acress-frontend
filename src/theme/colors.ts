/*
Paleta visual centralizada del sistema.

Objetivo:
- evitar colores hardcodeados;
- mantener identidad visual consistente;
- reutilizar colores en login, layouts y módulos;
- facilitar futuros ajustes de diseño.
*/
export const colors = {
  brand: {
    primary: "#2F6F46",
    primaryDark: "#123322",
    primaryLight: "#DDEEDC",
    accent: "#B9D98B",
  },

  background: {
    app: "#F3F6F1",
    surface: "#FFFFFF",
    soft: "#EEF5EF",
  },

  text: {
    primary: "#10291C",
    secondary: "#4F6B5A",
    muted: "#8DA193",
    inverse: "#FFFFFF",
  },

  border: {
    default: "#D8E4DA",
    strong: "#9FB5A5",
  },

  state: {
    success: "#2F7D4A",
    warning: "#C58A1F",
    error: "#B42318",
    disabled: "#9AA8A0",
  },

  /*
  Tokens reutilizables para representaciones
  visuales de productos.

  Permiten mantener una identidad consistente
  entre Productos, Compras, Stock, Reservas
  y futuros módulos que muestren productos.
  */
  product: {
    seedSurface: "#F7FCF8",
    seedBadgeSurface: "#F2FBF5",
    seedBorder: "#9FCFAE",

    flowerSurface: "#FFFFFF",
    flowerBadgeSurface: "#FFFFFF",
    flowerBorder: "#D8E4DA",
  },
} as const;