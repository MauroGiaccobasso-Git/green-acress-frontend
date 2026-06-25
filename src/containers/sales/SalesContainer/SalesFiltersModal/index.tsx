import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { salesStyles } from "../sales.styles";

export type SalesStatusFilter = "" | "REGISTRADA" | "ANULADA";

type SalesFiltersModalProps = {
  open: boolean;
  status: SalesStatusFilter;
  fromDate: string;
  toDate: string;
  onStatusChange: (value: SalesStatusFilter) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
};

/*
Modal encargado de administrar filtros
del historial de ventas.

Responsabilidades:
- filtrar por estado;
- filtrar por rango de fechas;
- permitir aplicar o limpiar filtros.

Criterio UX del proyecto:
- el modal funciona como constructor
  de una nueva búsqueda;
- cada apertura comienza con los
  controles visualmente limpios;
- el estado del listado y los filtros
  activos son administrados por el
  container.

No realiza llamadas HTTP.
No conoce la API.
No modifica ventas directamente.
*/
export function SalesFiltersModal({
  open,
  status,
  fromDate,
  toDate,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  onApply,
  onClear,
  onClose,
}: SalesFiltersModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: salesStyles.salesFiltersDialog,
        },
      }}
    >
      <DialogTitle sx={salesStyles.salesFiltersHeader}>
        <Box>
          <Typography sx={salesStyles.salesFiltersTitle}>Filtros</Typography>

          <Typography sx={salesStyles.salesFiltersSubtitle}>
            Refiná el historial por estado o fecha.
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={salesStyles.salesFiltersContent}>
        <Box sx={salesStyles.salesFiltersSection}>
          <Typography sx={salesStyles.salesFiltersLabel}>Estado</Typography>

          <Select
            fullWidth
            displayEmpty
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as SalesStatusFilter)
            }
            sx={salesStyles.salesFiltersSelect}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="REGISTRADA">Registradas</MenuItem>
            <MenuItem value="ANULADA">Anuladas</MenuItem>
          </Select>
        </Box>

        <Box sx={salesStyles.salesFiltersDivider} />

        <Box sx={salesStyles.salesFiltersSection}>
          <Typography sx={salesStyles.salesFiltersLabel}>Fecha</Typography>

          <Box sx={salesStyles.salesFiltersDateGrid}>
            <TextField
              label="Desde"
              type="date"
              value={fromDate}
              onChange={(event) => onFromDateChange(event.target.value)}
              sx={salesStyles.salesFiltersDateInput}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="Hasta"
              type="date"
              value={toDate}
              onChange={(event) => onToDateChange(event.target.value)}
              sx={salesStyles.salesFiltersDateInput}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={salesStyles.salesFiltersActions}>
        <Button onClick={onClear} sx={salesStyles.salesFiltersClearButton}>
          Limpiar
        </Button>

        <Button
          variant="contained"
          onClick={onApply}
          sx={salesStyles.salesFiltersApplyButton}
        >
          Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
