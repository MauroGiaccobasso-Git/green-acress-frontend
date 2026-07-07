import { Pagination } from "@mui/material";

import { paginationStyles } from "./pagination.styles";

type AppPaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

/*
Componente reutilizable de paginación
para módulos administrativos.

Centraliza la apariencia y evita que
cada módulo implemente su propio estilo.

No conoce datos del dominio.
Solo recibe página actual, total de páginas
y callback de cambio.
*/
export function AppPagination({
  page,
  totalPages,
  onChange,
}: AppPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination
      page={page}
      count={totalPages}
      size="small"
      onChange={(_, nextPage) => onChange(nextPage)}
      sx={paginationStyles.root}
    />
  );
}