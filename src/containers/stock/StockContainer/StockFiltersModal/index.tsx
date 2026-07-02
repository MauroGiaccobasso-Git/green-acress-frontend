import type { Dispatch, SetStateAction } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";

import { StockFilters } from "@/api/stockApi";

/*
Modal de filtros del módulo Stock.

Responsabilidades:
- renderizar los campos de filtrado del inventario;
- mantener una interfaz simple y consistente;
- delegar cambios y acciones al Container.

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
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Filtros de inventario

        <IconButton
          aria-label="Cerrar filtros"
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "grid", gap: 2.25, pt: 1 }}>
          <TextField
            label="Buscar producto"
            value={filterForm.search ?? ""}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            fullWidth
          />

          <TextField
            select
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
            fullWidth
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="FLOR">Flor</MenuItem>
            <MenuItem value="SEMILLA">Semilla</MenuItem>
          </TextField>

          <TextField
            select
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
            fullWidth
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="ACTIVO">Activo</MenuItem>
            <MenuItem value="INACTIVO">Inactivo</MenuItem>
          </TextField>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              pt: 1,
            }}
          >
            <Button variant="text" onClick={onClose}>
              Cancelar
            </Button>

            <Button variant="contained" onClick={onApply}>
              Aplicar filtros
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
