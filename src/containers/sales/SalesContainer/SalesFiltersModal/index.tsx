"use client";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
sobre el historial de ventas.

Responsabilidades:
- filtrar por estado;
- filtrar por rango de fechas;
- permitir aplicar, cancelar o limpiar criterios;
- presentar ayudas breves para reducir errores de uso.

El estado del listado y los filtros activos
continúa siendo administrado por el Container.

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
  const hasCriteria = Boolean(status || fromDate || toDate);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="sales-filters-title"
      aria-describedby="sales-filters-description"
      slotProps={{
        paper: {
          sx: salesStyles.salesFiltersDialog,
        },
      }}
    >
      <DialogTitle sx={salesStyles.salesFiltersHeader}>
        <Box sx={salesStyles.salesFiltersHeaderContent}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              id="sales-filters-title"
              component="h2"
              sx={salesStyles.salesFiltersTitle}
            >
              Filtrar ventas
            </Typography>

            <Typography
              id="sales-filters-description"
              sx={salesStyles.salesFiltersSubtitle}
            >
              Refiná el historial por estado o rango de fechas.
            </Typography>
          </Box>

          <IconButton
            aria-label="Cerrar filtros de ventas"
            onClick={onClose}
            sx={salesStyles.salesFiltersCloseButton}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={salesStyles.salesFiltersContent}>
        <Box sx={salesStyles.salesFiltersInfoBox}>
          <Box sx={salesStyles.salesFiltersInfoIcon}>
            <FilterAltOutlinedIcon fontSize="small" />
          </Box>

          <Box sx={salesStyles.salesFiltersInfoContent}>
            <Typography sx={salesStyles.salesFiltersInfoTitle}>
              Criterios combinables
            </Typography>

            <Typography sx={salesStyles.salesFiltersInfoText}>
              Podés aplicar un estado, un período o ambos criterios al mismo
              tiempo.
            </Typography>
          </Box>
        </Box>

        <Box sx={salesStyles.salesFiltersSection}>
          <Typography sx={salesStyles.salesFiltersSectionTitle}>
            Estado de la venta
          </Typography>

          <Select
            fullWidth
            displayEmpty
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as SalesStatusFilter)
            }
            inputProps={{
              "aria-label": "Estado de la venta",
            }}
            sx={salesStyles.salesFiltersSelect}
          >
            <MenuItem value="">Todas las ventas</MenuItem>
            <MenuItem value="REGISTRADA">Registradas</MenuItem>
            <MenuItem value="ANULADA">Anuladas</MenuItem>
          </Select>

          <Typography sx={salesStyles.salesFiltersHelperText}>
            Seleccioná el estado operativo que querés visualizar.
          </Typography>
        </Box>

        <Box sx={salesStyles.salesFiltersDivider} />

        <Box sx={salesStyles.salesFiltersSection}>
          <Typography sx={salesStyles.salesFiltersSectionTitle}>
            Período de registro
          </Typography>

          <Box sx={salesStyles.salesFiltersDateGrid}>
            <Box sx={salesStyles.salesFiltersDateField}>
              <Typography sx={salesStyles.salesFiltersDateLabel}>
                Desde
              </Typography>

              <TextField
                fullWidth
                type="date"
                value={fromDate}
                onChange={(event) => onFromDateChange(event.target.value)}
                slotProps={{
                  htmlInput: {
                    "aria-label": "Fecha desde",
                  },
                }}
                sx={salesStyles.salesFiltersDateInput}
              />
            </Box>

            <Box sx={salesStyles.salesFiltersDateField}>
              <Typography sx={salesStyles.salesFiltersDateLabel}>
                Hasta
              </Typography>

              <TextField
                fullWidth
                type="date"
                value={toDate}
                onChange={(event) => onToDateChange(event.target.value)}
                slotProps={{
                  htmlInput: {
                    "aria-label": "Fecha hasta",
                  },
                }}
                sx={salesStyles.salesFiltersDateInput}
              />
            </Box>
          </Box>

          <Typography sx={salesStyles.salesFiltersHelperText}>
            Podés completar una sola fecha o definir un rango completo.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={salesStyles.salesFiltersActions}>
        <Button
          onClick={onClear}
          disabled={!hasCriteria}
          startIcon={<RestartAltOutlinedIcon />}
          sx={salesStyles.salesFiltersClearButton}
        >
          Limpiar filtros
        </Button>

        <Box sx={salesStyles.salesFiltersPrimaryActions}>
          <Button onClick={onClose} sx={salesStyles.salesFiltersCancelButton}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={onApply}
            startIcon={<FilterAltOutlinedIcon />}
            sx={salesStyles.salesFiltersApplyButton}
          >
            Aplicar filtros
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}