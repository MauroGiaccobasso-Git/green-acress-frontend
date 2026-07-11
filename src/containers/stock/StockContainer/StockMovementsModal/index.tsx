import type { ReactNode } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import type { StockMovement, StockMovementFilters } from "@/api/stockApi";

import { stockStyles } from "../stock.styles";

/*
Modal de historial completo de movimientos de Stock.

Responsabilidades:
- mostrar el historial completo de movimientos de inventario;
- renderizar filtros administrativos del historial;
- renderizar estados de carga, error y vacío;
- permitir carga progresiva mediante "Cargar más";
- delegar acciones al Container.

No consulta APIs directamente.
No modifica estado global por fuera de sus props.
No contiene reglas de negocio.
*/
type StockMovementsModalProps = {
  open: boolean;
  movements: StockMovement[];
  movementFiltersForm: StockMovementFilters;
  movementError: string | null;
  loadingMovements: boolean;
  loadingMoreMovements: boolean;
  canLoadMoreMovements: boolean;
  onClose: () => void | Promise<void>;
  onFiltersChange: (filters: StockMovementFilters) => void;
  onApplyFilters: () => void | Promise<void>;
  onClearFilters: () => void | Promise<void>;
  onLoadMore: () => void | Promise<void>;
  renderMovementItem: (movement: StockMovement, index: number) => ReactNode;
};

export default function StockMovementsModal({
  open,
  movements,
  movementFiltersForm,
  movementError,
  loadingMovements,
  loadingMoreMovements,
  canLoadMoreMovements,
  onClose,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  onLoadMore,
  renderMovementItem,
}: StockMovementsModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Historial de movimientos de stock
        <IconButton
          aria-label="Cerrar historial de movimientos"
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "grid", gap: 2, pt: 1 }}>
          <Typography sx={stockStyles.panelSubtitle}>
            Consulta del historial específico de inventario con búsqueda
            dinámica, filtros administrables y carga progresiva.
          </Typography>

          <Box sx={stockStyles.movementModalFilterRows}>
            <Box sx={stockStyles.movementModalFilterMainRow}>
              <TextField
                label="Buscar producto"
                value={movementFiltersForm.search ?? ""}
                onChange={(event) =>
                  onFiltersChange({
                    ...movementFiltersForm,
                    search: event.target.value,
                  })
                }
                size="small"
                fullWidth
              />

              <TextField
                select
                label="Tipo de operación"
                value={
                  movementFiltersForm.eventoReserva ??
                  movementFiltersForm.referenciaTipo ??
                  ""
                }
                onChange={(event) => {
                  const value = event.target.value;

                  onFiltersChange({
                    ...movementFiltersForm,
                    tipo: undefined,
                    referenciaTipo:
                      value === "AJUSTE_MANUAL" ||
                      value === "COMPRA" ||
                      value === "VENTA" ||
                      value === "ANULACION_VENTA"
                        ? (value as StockMovementFilters["referenciaTipo"])
                        : undefined,
                    eventoReserva:
                      value === "CANCELADA" ||
                      value === "CONFIRMADA" ||
                      value === "VENCIDA"
                        ? (value as StockMovementFilters["eventoReserva"])
                        : undefined,
                  });
                }}
                size="small"
                fullWidth
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="AJUSTE_MANUAL">Ajuste manual</MenuItem>
                <MenuItem value="COMPRA">Compra</MenuItem>
                <MenuItem value="CANCELADA">Reserva cancelada</MenuItem>
                <MenuItem value="CONFIRMADA">Reserva confirmada</MenuItem>
                <MenuItem value="VENCIDA">Reserva vencida</MenuItem>
                <MenuItem value="VENTA">Venta</MenuItem>
                <MenuItem value="ANULACION_VENTA">Venta anulada</MenuItem>
              </TextField>
            </Box>

            <Box sx={stockStyles.movementModalFilterActionsRow}>
              <Box sx={stockStyles.movementModalDateFilters}>
                <TextField
                  label="Desde"
                  type="date"
                  value={movementFiltersForm.fechaDesde ?? ""}
                  onChange={(event) =>
                    onFiltersChange({
                      ...movementFiltersForm,
                      fechaDesde: event.target.value || undefined,
                    })
                  }
                  size="small"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                  label="Hasta"
                  type="date"
                  value={movementFiltersForm.fechaHasta ?? ""}
                  onChange={(event) =>
                    onFiltersChange({
                      ...movementFiltersForm,
                      fechaHasta: event.target.value || undefined,
                    })
                  }
                  size="small"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>

              <Box sx={stockStyles.movementModalFilterButtons}>
                <Button variant="text" onClick={onClearFilters}>
                  Limpiar filtros
                </Button>

                <Button variant="contained" onClick={onApplyFilters}>
                  Aplicar filtros
                </Button>
              </Box>
            </Box>
          </Box>

          {movementError && (
            <Box sx={stockStyles.errorBox}>{movementError}</Box>
          )}

          {loadingMovements ? (
            <Box sx={stockStyles.emptyState}>
              <CircularProgress size={28} />
              <Typography sx={stockStyles.emptyText}>
                Cargando historial...
              </Typography>
            </Box>
          ) : movements.length === 0 ? (
            <Box sx={stockStyles.emptyState}>
              <Typography sx={stockStyles.emptyTitle}>
                Sin movimientos registrados
              </Typography>
              <Typography sx={stockStyles.emptyText}>
                Ajustá los filtros o verificá si existen movimientos de stock.
              </Typography>
            </Box>
          ) : (
            <Box sx={stockStyles.movementModalList}>
              {movements.map(renderMovementItem)}
            </Box>
          )}

          {loadingMoreMovements ? (
            <Box sx={stockStyles.loadMoreFeedback}>
              <CircularProgress size={22} />
              <Typography sx={stockStyles.emptyText}>
                Cargando movimientos...
              </Typography>
            </Box>
          ) : (
            canLoadMoreMovements && (
              <Button
                variant="outlined"
                sx={stockStyles.loadMoreButton}
                onClick={onLoadMore}
              >
                Cargar más
              </Button>
            )
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}