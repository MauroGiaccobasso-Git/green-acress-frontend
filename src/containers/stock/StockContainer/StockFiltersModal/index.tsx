"use client";

import type { Dispatch, SetStateAction } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import type { StockFilters } from "@/api/stockApi";

import { stockStyles } from "../stock.styles";

/*
Modal de filtros del módulo Stock.

Responsabilidades:
- renderizar los criterios secundarios del inventario;
- permitir combinar búsqueda, tipo y estado;
- limpiar únicamente el formulario transitorio del modal;
- delegar la aplicación de filtros al Container.

Criterio UX:
- mantiene el patrón visual Gold de los modales administrativos;
- comunica que los criterios pueden combinarse;
- diferencia limpiar, cancelar y aplicar;
- conserva una experiencia responsive y accesible.

No realiza llamadas HTTP.
No conoce la capa API.
No aplica filtros por sí mismo.
*/
type StockFiltersModalProps = {
  open: boolean;

  filterForm: StockFilters;

  onChange: Dispatch<SetStateAction<StockFilters>>;

  onClose: () => void;

  onApply: () => void;
};

export default function StockFiltersModal({
  open,
  filterForm,
  onChange,
  onClose,
  onApply,
}: StockFiltersModalProps) {
  const hasActiveFilters = Boolean(
    filterForm.search?.trim() || filterForm.tipo || filterForm.estado,
  );

  const handleClear = () => {
    onChange({
      search: "",
      tipo: undefined,
      estado: undefined,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="stock-filters-title"
      aria-describedby="stock-filters-description"
      slotProps={{
        paper: {
          sx: stockStyles.stockFiltersDialogPaper,
        },
      }}
    >
      <DialogTitle sx={stockStyles.stockFiltersHeader}>
        <Box sx={stockStyles.stockFiltersHeaderContent}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              id="stock-filters-title"
              component="h2"
              sx={stockStyles.stockFiltersTitle}
            >
              Filtrar inventario
            </Typography>

            <Typography
              id="stock-filters-description"
              sx={stockStyles.stockFiltersSubtitle}
            >
              Refiná el listado por producto, tipo o estado operativo.
            </Typography>
          </Box>

          <IconButton
            aria-label="Cerrar filtros de inventario"
            onClick={onClose}
            sx={stockStyles.stockFiltersCloseButton}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={stockStyles.stockFiltersContent}>
        <Box sx={stockStyles.stockFiltersInfoCard}>
          <Box sx={stockStyles.stockFiltersInfoIcon}>
            <FilterAltOutlinedIcon />
          </Box>

          <Box sx={stockStyles.stockFiltersInfoContent}>
            <Typography sx={stockStyles.stockFiltersInfoTitle}>
              Criterios combinables
            </Typography>

            <Typography sx={stockStyles.stockFiltersInfoText}>
              Podés buscar por nombre y combinar el resultado con el tipo y el
              estado del producto.
            </Typography>
          </Box>
        </Box>

        <Typography sx={stockStyles.stockFiltersSectionTitle}>
          Criterios del inventario
        </Typography>

        <Box sx={stockStyles.stockFiltersFieldsGrid}>
          <Box sx={stockStyles.stockFiltersFieldGroup}>
            <TextField
              fullWidth
              label="Buscar producto"
              placeholder="Nombre del producto"
              value={filterForm.search ?? ""}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
              slotProps={{
                htmlInput: {
                  "aria-label": "Buscar producto en el inventario",
                },
              }}
              sx={stockStyles.stockFiltersField}
            />

            <Typography sx={stockStyles.stockFiltersHelperText}>
              Busca coincidencias por el nombre registrado del producto.
            </Typography>
          </Box>

          <Box sx={stockStyles.stockFiltersFieldGroup}>
            <TextField
              select
              fullWidth
              label="Tipo de producto"
              value={filterForm.tipo ?? ""}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  tipo: event.target.value
                    ? (event.target.value as StockFilters["tipo"])
                    : undefined,
                }))
              }
              sx={stockStyles.stockFiltersField}
            >
              <MenuItem value="">Todos los tipos</MenuItem>
              <MenuItem value="FLOR">Flor</MenuItem>
              <MenuItem value="SEMILLA">Semilla</MenuItem>
            </TextField>

            <Typography sx={stockStyles.stockFiltersHelperText}>
              Limita el listado a flores o semillas.
            </Typography>
          </Box>

          <Box sx={stockStyles.stockFiltersFieldGroup}>
            <TextField
              select
              fullWidth
              label="Estado"
              value={filterForm.estado ?? ""}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  estado: event.target.value
                    ? (event.target.value as StockFilters["estado"])
                    : undefined,
                }))
              }
              sx={stockStyles.stockFiltersField}
            >
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="ACTIVO">Activo</MenuItem>
              <MenuItem value="INACTIVO">Inactivo</MenuItem>
            </TextField>

            <Typography sx={stockStyles.stockFiltersHelperText}>
              Filtra según la disponibilidad operativa del producto.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={stockStyles.stockFiltersActions}>
        <Button
          variant="outlined"
          startIcon={<RestartAltRoundedIcon />}
          disabled={!hasActiveFilters}
          onClick={handleClear}
          sx={stockStyles.stockFiltersClearButton}
        >
          Limpiar filtros
        </Button>

        <Box sx={stockStyles.stockFiltersPrimaryActions}>
          <Button
            variant="text"
            onClick={onClose}
            sx={stockStyles.stockFiltersCancelButton}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            startIcon={<FilterAltOutlinedIcon />}
            onClick={onApply}
            sx={stockStyles.stockFiltersApplyButton}
          >
            Aplicar filtros
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}