import { Box, Button, Chip, Popover, Typography } from "@mui/material";

import { productsStyles } from "../products.styles";

type ProductFilters = {
  type: string;
  status: string;
  genetics: string;
};

type ProductFiltersModalProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  filters: ProductFilters;
  onClose: () => void;
  onClearFilters: () => void;
  onChangeFilters: (filters: ProductFilters) => void;
  formatLabel: (value?: string | null) => string;
};

const productTypeOptions = ["TODOS", "FLOR", "SEMILLA"];

const productStatusOptions = ["TODOS", "ACTIVO", "INACTIVO"];

const productGeneticsOptions = ["TODOS", "INDICA", "SATIVA", "HIBRIDA"];

/*
Popover de filtros del módulo Productos.

Responsabilidades:
- renderizar los filtros disponibles;
- mostrar el estado visual activo de cada filtro;
- delegar cambios al ProductsContainer mediante callbacks.

No filtra productos.
No consulta backend.
No administra búsqueda.
*/
export function ProductFiltersModal({
  open,
  anchorEl,
  filters,
  onClose,
  onClearFilters,
  onChangeFilters,
  formatLabel,
}: ProductFiltersModalProps) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: productsStyles.filterPopoverPaper,
        },
      }}
    >
      <Box sx={productsStyles.filterPopoverContent}>
        <Box sx={productsStyles.filterPopoverHeader}>
          <Typography variant="h6" sx={productsStyles.filterDialogTitle}>
            Filtros de productos
          </Typography>
        </Box>

        <Box sx={productsStyles.filterSection}>
          <Box sx={productsStyles.filterSectionHeader}>
            <Typography variant="subtitle2" sx={productsStyles.filterTitle}>
              Tipo de producto
            </Typography>

            <Typography variant="caption" sx={productsStyles.filterSectionHelp}>
              Filtrar por tipo de producto.
            </Typography>
          </Box>

          <Box sx={productsStyles.modalChipGroup}>
            {productTypeOptions.map((type) => (
              <Chip
                key={type}
                label={formatLabel(type)}
                onClick={() =>
                  onChangeFilters({
                    ...filters,
                    type,
                  })
                }
                sx={
                  filters.type === type
                    ? productsStyles.activeFilterChip
                    : productsStyles.filterChip
                }
              />
            ))}
          </Box>
        </Box>

        <Box sx={productsStyles.filterSection}>
          <Box sx={productsStyles.filterSectionHeader}>
            <Typography variant="subtitle2" sx={productsStyles.filterTitle}>
              Estado
            </Typography>

            <Typography variant="caption" sx={productsStyles.filterSectionHelp}>
              Filtrar por estado del producto.
            </Typography>
          </Box>

          <Box sx={productsStyles.modalChipGroup}>
            {productStatusOptions.map((status) => (
              <Chip
                key={status}
                label={formatLabel(status)}
                onClick={() =>
                  onChangeFilters({
                    ...filters,
                    status,
                  })
                }
                sx={
                  filters.status === status
                    ? productsStyles.activeFilterChip
                    : productsStyles.filterChip
                }
              />
            ))}
          </Box>
        </Box>

        <Box sx={productsStyles.filterSection}>
          <Box sx={productsStyles.filterSectionHeader}>
            <Typography variant="subtitle2" sx={productsStyles.filterTitle}>
              Genética
            </Typography>

            <Typography variant="caption" sx={productsStyles.filterSectionHelp}>
              Filtrar por genética del producto.
            </Typography>
          </Box>

          <Box sx={productsStyles.modalChipGroup}>
            {productGeneticsOptions.map((genetics) => (
              <Chip
                key={genetics}
                label={formatLabel(genetics)}
                onClick={() =>
                  onChangeFilters({
                    ...filters,
                    genetics,
                  })
                }
                sx={
                  filters.genetics === genetics
                    ? productsStyles.activeFilterChip
                    : productsStyles.filterChip
                }
              />
            ))}
          </Box>
        </Box>

        <Box sx={productsStyles.filterFooter}>
          <Button
            sx={productsStyles.filterClearButton}
            onClick={onClearFilters}
          >
            Limpiar
          </Button>

          <Button
            variant="contained"
            sx={productsStyles.filterApplyButton}
            onClick={onClose}
          >
            Aplicar
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}