import { colors } from "@/theme/colors";

/*
Estilos reutilizables del componente
de paginación administrativa.

Mantiene una identidad visual única
para todos los módulos del panel.

La lógica permanece dentro del
componente AppPagination.
*/

export const paginationStyles = {
  root: {
    "& .MuiPagination-ul": {
      gap: 1.05,
      alignItems: "center",
    },

    "& .MuiPaginationItem-root": {
      minWidth: 38,
      height: 38,
      borderRadius: "10px",
      border: `1px solid ${colors.border.default}`,
      color: colors.text.primary,
      backgroundColor: colors.background.surface,
      fontSize: 13.2,
      fontWeight: 700,
      margin: 0,
      transition: "all 160ms ease",
    },

    "& .MuiPaginationItem-root:hover": {
      borderColor: colors.border.strong,
      backgroundColor: colors.background.soft,
    },

    "& .MuiPaginationItem-root.Mui-selected": {
      color: colors.text.inverse,
      backgroundColor: colors.brand.primary,
      borderColor: colors.brand.primary,
      boxShadow: "0 10px 20px rgba(47, 111, 70, 0.22)",
    },

    "& .MuiPaginationItem-root.Mui-selected:hover": {
      backgroundColor: colors.brand.primary,
      borderColor: colors.brand.primary,
    },

    "& .MuiPaginationItem-previousNext": {
      color: colors.text.primary,
      backgroundColor: colors.background.surface,
    },

    "& .MuiPaginationItem-previousNext.Mui-disabled": {
      opacity: 0.42,
    },

    "& .MuiSvgIcon-root": {
      fontSize: 19,
    },
  },
};